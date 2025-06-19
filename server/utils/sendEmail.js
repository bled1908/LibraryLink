import nodemailer from 'nodemailer';
export const sendEmail = async ({email, subject, message}) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE, // e.g., 'gmail', 'yahoo', etc.
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_MAIL, // Your SMTP username (usually your email address)
            pass: process.env.SMTP_PASSWORD, // Your SMTP password or app password
        },
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL, // Sender address
        to: email, // List of recipients
        subject: subject, // Subject line
        html: message, // HTML body content
    };

    await transporter.sendMail(mailOptions);
};