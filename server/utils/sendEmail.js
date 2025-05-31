const nodemailer = require("nodemailer");

exports.sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or use your SMTP settings
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });
};
