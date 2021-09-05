const nodemailer = require('nodemailer');
const dotenv=require("dotenv").config();
const mg=require('nodemailer-mailgun-transport');


const sendEmail = async (options, cb) => {
  const auth={
    auth: {
      api_key: process.env.MAILGUN_API,
      domain: process.env.MAILGUN_DOMAIN
    }
  }
  let transporter=nodemailer.createTransport(mg(auth));
  const mailOptions = {
    from: 'Breathings App <Breathingsapp@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions, function(err, data){
    if (err) {
      cb(err, null);
    } else {
      cb( null, data);
    }
  });
};

module.exports = sendEmail;
