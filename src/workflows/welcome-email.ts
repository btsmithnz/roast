import { FatalError, sleep } from "workflow";
import { Resend } from "resend";

type WelcomeEmailInput = {
  email: string;
  name: string;
};

function appUrl(pathname: string) {
  const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
  return new URL(pathname, baseUrl).toString();
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

export async function sendWelcomeEmailAfterSignup(input: WelcomeEmailInput) {
  "use workflow";

  await sleep("1m");
  await sendWelcomeEmail(input);
}

async function sendWelcomeEmail({ email, name }: WelcomeEmailInput) {
  "use step";

  if (!process.env.RESEND_API_KEY) {
    throw new FatalError("RESEND_API_KEY is required to send welcome emails.");
  }
  if (!process.env.RESEND_FROM_EMAIL) {
    throw new FatalError("RESEND_FROM_EMAIL is required to send welcome emails.");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL;
  const displayName = name || "there";
  const accountUrl = appUrl("/account");
  const escapedDisplayName = escapeHtml(displayName);
  const escapedAccountUrl = escapeHtml(accountUrl);
  const { error } = await resend.emails.send({
    from,
    to: [email],
    subject: "Welcome to Roast",
    text: [
      `Hi ${displayName},`,
      "",
      "Welcome to Roast. You can now save favourite cafes, review coffees, and manage your cafe profiles from your account.",
      "",
      `Open your account: ${accountUrl}`,
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #201b16;">
        <h1 style="font-size: 24px; margin: 0 0 16px;">Welcome to Roast</h1>
        <p>Hi ${escapedDisplayName},</p>
        <p>
          You can now save favourite cafes, review coffees, and manage your cafe profiles
          from your account.
        </p>
        <p>
          <a href="${escapedAccountUrl}" style="color: #8b4513; font-weight: 700;">Open your account</a>
        </p>
      </div>
    `,
  });

  if (!error) {
    return;
  }

  if (
    error.statusCode === 429 ||
    (error.statusCode && error.statusCode >= 500)
  ) {
    throw new Error(error.message);
  }

  throw new FatalError(error.message);
}
