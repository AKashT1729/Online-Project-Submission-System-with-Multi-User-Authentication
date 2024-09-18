import nodemailer from "nodemailer";

// Set up nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
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

export {sendOtpEmail}