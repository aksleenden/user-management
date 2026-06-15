const nodemailer = require("nodemailer");

let transporter = null;

// getTransporter
// ---------------
// Note: lazily creates a single shared nodemailer transporter from the SMTP_*
// environment variables. Re-used for every e-mail so we don't reconnect each time.
function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

async function sendVerificationEmail(toEmail, verificationToken) {
  const verifyUrl = `${process.env.CLIENT_URL}/verify/${verificationToken}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: toEmail,
    subject: "Confirm your e-mail address",
    text: `Welcome! Please confirm your e-mail address by opening this link: ${verifyUrl}`,
    html: `<p>Welcome!</p><p>Please confirm your e-mail address by clicking the link below:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
  };

  try {
    await getTransporter().sendMail(mailOptions);
    console.log(`Verification e-mail sent to ${toEmail}`);
  } catch (err) {
    console.error(
      `Failed to send verification e-mail to ${toEmail}:`,
      err.message,
    );
  }
}

module.exports = { sendVerificationEmail };
