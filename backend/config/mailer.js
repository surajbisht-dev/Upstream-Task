import { env } from "./env.js";

export const sendApprovalEmail = async ({ to, subject, html, links }) => {
  if (env.mailMode === "console") {
    console.log("\n--- EMAIL PREVIEW (console mode) ---");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Action Links:", links);
    console.log("-----------------------------------\n");
    return;
  }

  console.log("MAIL_MODE not implemented fully, using console fallback");
  console.log("Links:", links);
};
