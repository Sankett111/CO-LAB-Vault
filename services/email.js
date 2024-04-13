const nodemailer = require("nodemailer");
module.exports = async ({ from, to, subject, text, html}) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
        });
        let info = await transporter.sendMail({
        from: `CO-LAB Vault <${from}>`, 
        to: to, 
        subject: subject,
        text: text, 
        html: html, 
    });
    
    console.log(info);
}
module.exports 