const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// sendVerificationEmail
// -----------------------
// IMPORTANT: uses Resend's HTTPS API instead of raw SMTP, since Render's
// free tier blocks outbound SMTP ports (25/465/587).
async function sendVerificationEmail(toEmail, verificationToken) {
  const verifyUrl = `${process.env.CLIENT_URL}/verify/${verificationToken}`;

  try {
    await resend.emails.send({
      from: process.env.SMTP_FROM || "onboarding@resend.dev",
      to: toEmail,
      subject: "Confirm your e-mail address",
      html: `<p>Welcome!</p><p>Please confirm your e-mail address by clicking the link below:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
    });
    console.log(`Verification e-mail sent to ${toEmail}`);
  } catch (err) {
    console.error(
      `Failed to send verification e-mail to ${toEmail}:`,
      err.message,
    );
  }
}

module.exports = { sendVerificationEmail };
