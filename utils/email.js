const sendgrid = require("@sendgrid/mail")
sendgrid.setApiKey(process.env.SEND_GRID_API_KEY)
exports.sendEmail = async function (toEmail, subject, message) {
    var mailOptions = {
        from: process.env.ORGANIZATION_MAIL_ID,
        to: toEmail,
        subject: subject,
        text: message,
    };
    const sendEmail = await sendgrid.send(mailOptions)
    if(sendEmail) {
        return 1
    } else {
        return 0
    }
}