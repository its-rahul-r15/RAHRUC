const axios = require('axios');
const env = require('../config/env');

const sendOtpEmail = async (to, code) => {
  const apiKey = env.RESEND_API_KEY;

  const htmlContent = `
    <div style="font-family: sans-serif; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #f1f5f9; border-radius: 16px;">
      <h2 style="color: #ff7a00; font-size: 24px; font-weight: 800; margin-bottom: 16px;">Verify your RAHRUC Account</h2>
      <p style="color: #334155; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
        Here is your verification code to complete your login/signup request. This code is valid for 10 minutes:
      </p>
      <div style="background-color: #fafafa; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
        <span style="font-size: 32px; font-weight: 800; color: #1e293b; letter-spacing: 4px;">${code}</span>
      </div>
      <p style="color: #64748b; font-size: 12px; line-height: 1.5;">
        If you did not request this code, you can safely ignore this email.
      </p>
    </div>
  `;

  try {
    const response = await axios.post('https://api.resend.com/emails', {
      from: 'RAHRUC <onboarding@resend.dev>',
      to,
      subject: `RAHRUC Verification Code: ${code}`,
      html: htmlContent
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to send OTP email via Resend:', error.response?.data || error.message);
    throw new Error('Error sending email verification code');
  }
};

module.exports = {
  sendOtpEmail
};
