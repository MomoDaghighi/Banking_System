const nodemailer = require('nodemailer');
const notificationConfig = require('../../config/notificationConfig');

const transporter = nodemailer.createTransport({
    service: notificationConfig.email.service,
    auth: {
        user: notificationConfig.email.user,
        pass: notificationConfig.email.pass
    }
});

const notificationService = {
    async sendEmail(to, subject, text) {
        const mailOptions = {
            from: notificationConfig.email.from,
            to: to,
            subject: subject,
            text: text
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    },
};

module.exports = notificationService;
