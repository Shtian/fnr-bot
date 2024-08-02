import crypto from "crypto";
import qs from "qs";
import { NowRequest } from "@now/node";

export function verifySignature(
  req: NowRequest,
  slackSigningSecret: string | undefined,
): boolean {
  // using qs and RFC1738 to ensure that the request body whitespace
  // is preserved in line with how slack calculates the signature
  const requestBody = qs.stringify(req.body, { format: "RFC1738" });
  const slackSignature = req.headers["x-slack-signature"] as string;
  const timestamp = req.headers["x-slack-request-timestamp"];
  const time = Math.floor(new Date().getTime() / 1000);

  if (Math.abs(time - Number(timestamp)) > 300) {
    console.error("Request timestamp is too old");
    return false;
  }

  if (!slackSigningSecret) {
    console.error("Slack signing secret not set");
    return false;
  }

  const sigBasestring = "v0:" + timestamp + ":" + requestBody;
  const mySignature =
    "v0=" +
    crypto
      .createHmac("sha256", slackSigningSecret)
      .update(sigBasestring, "utf8")
      .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(mySignature, "utf8"),
    Buffer.from(slackSignature, "utf8"),
  );
}
