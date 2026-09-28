import { logger } from "./logger.js";

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export async function sendAlert(level, message, details = {}) {
  // Always log locally
  logger.warn(`ALERT [${level}]: ${message}`, details);

  if (!SLACK_WEBHOOK_URL) {
    return;
  }

  try {
    const payload = {
      text: `⚠️ *[${level}] Payment Flow Alert* ⚠️\n\n*Message:* ${message}\n*Timestamp:* ${new Date().toISOString()}\n*Details:* \`\`\`${JSON.stringify(details, null, 2)}\`\`\``,
    };

    const res = await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      logger.error("Slack webhook returned non-OK status", { statusCode: res.status });
    }
  } catch (err) {
    logger.error("Failed to send Slack alert webhook", { error: err });
  }
}
