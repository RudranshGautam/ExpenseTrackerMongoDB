const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;

client.authentications['api-key'].apiKey = '';

const sendEmail = async (to, subject, htmlContent) => {
    const emailApi = new Sib.TransactionalEmailsApi();
    await emailApi.sendTransacEmail({
        sender: { email: 'rudranshgautam11@gmail.com', name: 'Expense Tracker' },
        to: [{ email: to }],
        subject,
        htmlContent,
    });
};

module.exports = sendEmail;
