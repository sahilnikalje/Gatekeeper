const axios = require('axios')

const sendEmail = async ({ to, subject, html }) => {
    const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
            sender: { 
                email: process.env.SENDER_EMAIL, 
                name: "Gatekeeper" 
            },
            to: [{ email: to }],
            subject,
            htmlContent: html,
        },
        {
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json',
            }
        }
    )
    return response.data
}

module.exports = { sendEmail }
