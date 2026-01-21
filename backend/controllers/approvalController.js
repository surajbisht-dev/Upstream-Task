import { Approval } from "../models/approvalModel.js";
import { env } from "../config/env.js";
import {
  createActionToken,
  verifyActionToken,
} from "../services/tokenService.js";
import { hashToken } from "../utils/hashUtil.js";
import { sendApprovalEmail } from "../config/mailer.js";

export const createApproval = async (req, res, next) => {
  try {
    const { title, description = "", approverEmail } = req.body;

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // create tokens
    const approveToken = createActionToken({
      approvalId: "temp",
      action: "approve",
    });
    const rejectToken = createActionToken({
      approvalId: "temp",
      action: "reject",
    });
    const holdToken = createActionToken({ approvalId: "temp", action: "hold" });

    // first create approval to get ID
    const approval = await Approval.create({
      title,
      description,
      approverEmail,
      status: "Pending",
      expiresAt,
      tokens: {
        approve: { hash: "temp" },
        reject: { hash: "temp" },
        hold: { hash: "temp" },
      },
    });

    const realApproveToken = createActionToken({
      approvalId: approval._id.toString(),
      action: "approve",
    });
    const realRejectToken = createActionToken({
      approvalId: approval._id.toString(),
      action: "reject",
    });
    const realHoldToken = createActionToken({
      approvalId: approval._id.toString(),
      action: "hold",
    });

    approval.tokens.approve.hash = hashToken(realApproveToken);
    approval.tokens.reject.hash = hashToken(realRejectToken);
    approval.tokens.hold.hash = hashToken(realHoldToken);

    await approval.save();

    const approveLink = `${env.appBaseUrl}/api/approvals/action?token=${encodeURIComponent(realApproveToken)}`;
    const rejectLink = `${env.appBaseUrl}/api/approvals/action?token=${encodeURIComponent(realRejectToken)}`;
    const holdLink = `${env.appBaseUrl}/api/approvals/action?token=${encodeURIComponent(realHoldToken)}`;

    await sendApprovalEmail({
      to: approverEmail,
      subject: `Approval needed: ${title}`,
      html: "<p>Use the links to Approve/Reject/Hold</p>",
      links: { approveLink, rejectLink, holdLink },
    });

    res.status(201).json({
      approval,
      links: { approveLink, rejectLink, holdLink },
    });
  } catch (err) {
    next(err);
  }
};

export const getApprovalById = async (req, res, next) => {
  try {
    const approval = await Approval.findById(req.params.id);
    if (!approval)
      return res.status(404).json({ message: "Approval not found" });
    res.json(approval);
  } catch (err) {
    next(err);
  }
};

export const listApprovals = async (req, res, next) => {
  try {
    const approvals = await Approval.find().sort({ createdAt: -1 });
    res.json(approvals);
  } catch (err) {
    next(err);
  }
};

export const approvalAction = async (req, res, next) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(400).send(simpleHtml("Missing token"));

    const payload = verifyActionToken(token); // throws if expired/invalid
    const approvalId = payload.rid;
    const action = payload.act; // approve/reject/hold

    const approval = await Approval.findById(approvalId);
    if (!approval) return res.status(404).send(simpleHtml("Request not found"));

    // overall expiry check
    if (approval.expiresAt && new Date() > approval.expiresAt) {
      return res
        .status(400)
        .send(simpleHtml("Token expired (request expired)"));
    }

    const tokenHash = hashToken(token);

    const tokenObj = approval.tokens?.[action];
    if (!tokenObj || !tokenObj.hash) {
      return res
        .status(400)
        .send(simpleHtml("Token not available or already used"));
    }

    if (tokenObj.hash !== tokenHash) {
      return res.status(400).send(simpleHtml("Invalid token (hash mismatch)"));
    }

    if (tokenObj.consumedAt) {
      return res.status(400).send(simpleHtml("Token already used"));
    }

    if (action === "approve") approval.status = "Approved";
    if (action === "reject") approval.status = "Rejected";
    if (action === "hold") approval.status = "On Hold";

    tokenObj.consumedAt = new Date();
    tokenObj.hash = null;

    await approval.save();

    return res.send(simpleHtml(`Done! Status is now: ${approval.status}`));
  } catch (err) {
    // if jwt expired, show simple msg
    if (err.name === "TokenExpiredError") {
      return res.status(400).send(simpleHtml("Token expired"));
    }
    next(err);
  }
};

const simpleHtml = (message) => {
  return `
    <html>
      <head><title>Approval Action</title></head>
      <body style="font-family:Arial;padding:20px;">
        <h3>${message}</h3>
        <p>You can close this tab.</p>
      </body>
    </html>
  `;
};
