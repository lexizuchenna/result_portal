const nodemailer = require("nodemailer");

module.exports = {
  generateNum: async (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  sendMail: async (from, email, subject, to, html) => {
    let transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: `"${from}" <${email}>`,
      subject,
      to,
      html,
    });
  },
};