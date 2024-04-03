const notificationConfig = {
  email: {
      service: 'YourEmailService',
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
      from: 'no-reply@yourbank.com',
  },
};

module.exports = notificationConfig;
