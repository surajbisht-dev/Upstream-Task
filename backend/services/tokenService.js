import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env.js";

export const createActionToken = ({
  approvalId,
  action,
  expiresIn = "24h",
}) => {
  const jti = crypto.randomUUID();

  const token = jwt.sign(
    {
      typ: "approval-action",
      rid: approvalId,
      act: action,
      jti,
    },
    env.jwtSecret,
    { expiresIn },
  );

  return token;
};

export const verifyActionToken = (token) => {
  const payload = jwt.verify(token, env.jwtSecret);

  if (!payload || payload.typ !== "approval-action") {
    const err = new Error("Invalid token type");
    err.statusCode = 400;
    throw err;
  }

  if (!payload.rid || !payload.act) {
    const err = new Error("Invalid token payload");
    err.statusCode = 400;
    throw err;
  }

  return payload;
};
