const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports.sendModerationResult = async (userEmail, status, offerText) => {
  const isApproved = status === 'pending';

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Ваша пропозиція була ${isApproved ? 'схвалена' : 'відхилена'}`,
    text: `Вітаємо! Ваша пропозиція "${offerText}" змінила статус на: ${status}.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Nodemailer Error:', error);
    throw error;
  }
};
