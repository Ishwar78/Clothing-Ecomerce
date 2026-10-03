const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

/**
 * Send OTP Email
 * @param {string} toEmail - Recipient email
 * @param {string} otp - 6-digit OTP code
 * @param {string} purpose - 'signup' | 'login'
 * @param {string} name - User's name (optional)
 */
async function sendOtpEmail(toEmail, otp, purpose = 'login', name = '') {
    const isSignup = purpose === 'signup';
    const actionText = isSignup ? 'creating your account' : 'logging into your account';
    const titleText = isSignup ? 'Verify Your Account' : 'Login Verification Code';

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${titleText}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2d2626;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f7f5f2; padding: 40px 0;">
            <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.07); border: 1px solid #eae3dc;">
                        <!-- Header -->
                        <tr>
                            <td align="center" style="background-color: #1e1919; padding: 32px 20px;">
                                <div style="color: #d4af37; font-size: 13px; letter-spacing: 3px; font-weight: 600; text-transform: uppercase; margin-bottom: 6px;">✦ SBV FASHION ✦</div>
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;">S S VASTRALAYA</h1>
                                <p style="color: #a89f91; margin: 4px 0 0 0; font-size: 12px; letter-spacing: 2px;">TRADITION MEETS TREND</p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 32px 30px 32px; text-align: center;">
                                <h2 style="margin: 0 0 12px 0; color: #1e1919; font-size: 22px; font-weight: 600;">${titleText}</h2>
                                <p style="margin: 0 0 24px 0; color: #665b5b; font-size: 15px; line-height: 1.6;">
                                    ${name ? `Hello <strong>${name}</strong>,<br/>` : 'Hello,'}
                                    Use the verification code below to complete ${actionText} at <strong>S S Vastralaya</strong>.
                                </p>

                                <!-- OTP Box -->
                                <div style="background: linear-gradient(135deg, #faf7f2 0%, #f4eee6 100%); border: 2px dashed #d4af37; border-radius: 10px; padding: 22px 10px; margin: 24px 0;">
                                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #8c7b6d; margin-bottom: 8px; font-weight: 600;">Your One-Time Password (OTP)</div>
                                    <div style="font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #1e1919; font-family: 'Courier New', Courier, monospace; padding-left: 12px;">${otp}</div>
                                </div>

                                <p style="margin: 20px 0 0 0; color: #8c7b6d; font-size: 13px; line-height: 1.5;">
                                    ⏱️ This code will expire in <strong>10 minutes</strong>.<br/>
                                    🔒 For security reasons, please do not share this code with anyone.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #faf7f5; border-top: 1px solid #f0e9e2; padding: 24px 32px; text-align: center; color: #9c8f84; font-size: 12px; line-height: 1.6;">
                                <p style="margin: 0 0 6px 0;">If you did not request this verification code, please ignore this email.</p>
                                <p style="margin: 0;">&copy; ${new Date().getFullYear()} S S Vastralaya. All Rights Reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"S S Vastralaya (SBV)" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: `${otp} is your ${titleText} - S S Vastralaya`,
        html: htmlContent
    };

    return await transporter.sendMail(mailOptions);
}

module.exports = {
    transporter,
    sendOtpEmail
};
