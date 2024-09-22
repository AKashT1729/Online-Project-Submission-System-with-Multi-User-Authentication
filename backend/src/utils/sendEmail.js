import nodemailer from "nodemailer";

// Set up nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Generate and send OTP email
const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Your Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

const sendStatusEmail = async (email, guideStatus, hodStatus) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Project Submission Status Update",
    text: `Dear Student,

Your project submission status has been updated.

- Project Guide Status: ${guideStatus}
- HoD Status: ${hodStatus}

Please check your dashboard for more details.

Best regards,
Your University Team`,
  };
  await transporter.sendMail(mailOptions);
};

export { sendOtpEmail ,sendStatusEmail};
