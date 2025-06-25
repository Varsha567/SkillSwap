const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config(); // Ensure dotenv is configured here as well

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // Use 'true' for 465, 'false' for other ports (like 587)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    // Required for some providers if you face issues (e.g. Gmail for less secure apps)
    // tls: {
    //     ciphers: 'SSLv3'
    // }
});

// Function to send a generic email
// To be consistent with the password reset functionality, 
// let's adjust this to accept an object for options.
exports.sendEmail = async (options) => {
    const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // Sender address
        to: options.email,      // List of receivers
        subject: options.subject, // Subject line
        html: options.html,       // HTML body
        text: options.text || '', // Plain text body (optional, good for fallback)
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${options.email}`);
        return true; // Indicate success
    } catch (error) {
        console.error(`Error sending email to ${options.email}:`, error);
        return false; // Indicate failure
    }
};
