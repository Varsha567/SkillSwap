const nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure dotenv is loaded for env variables

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' for testing; for production, change to 'smtp.sendgrid.net', etc.
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
    // If you're using a specific port/host for a non-Gmail service:
    // host: "smtp.example.com",
    // port: 587,
    // secure: false, // true for 465, false for other ports
});

const sendEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: `"SkillSwap Platform" <${process.env.EMAIL_USER}>`, // Sender address
        to: to, // List of receivers
        subject: subject, // Subject line
        html: htmlContent, // html body
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        // Optional: console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        return true;
    } catch (error) {
        console.error('Error sending email to', to, ':', error);
        if (error.response) {
            console.error('Nodemailer response error:', error.response);
        }
        return false;
    }
};

module.exports = { sendEmail };