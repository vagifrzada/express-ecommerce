const mailer = require("nodemailer");

const transport = mailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_PORT === 465,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    },
    tls: {
        ciphers: 'SSLv3'
    },
});

async function sendEmail(params) {
    return await transport.sendMail({
        to: params.to,
        from: process.env.MAIL_FROM_EMAIL,
        subject: params.subject,
        html: params.body
    })
}

module.exports = {
    sendEmail,
}