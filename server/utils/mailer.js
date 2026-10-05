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
 * Format fallback image URL for email rendering
 */
function getEmailImageUrl(img) {
    if (!img) return 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=300&q=80';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    return 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=300&q=80';
}

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
                                <div style="color: #d4af37; font-size: 13px; letter-spacing: 3px; font-weight: 600; text-transform: uppercase; margin-bottom: 6px;">✦ Joyfulmarts FASHION ✦</div>
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;">Joyfulmarts</h1>
                                <p style="color: #a89f91; margin: 4px 0 0 0; font-size: 12px; letter-spacing: 2px;">TRADITION MEETS TREND</p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 32px 30px 32px; text-align: center;">
                                <h2 style="margin: 0 0 12px 0; color: #1e1919; font-size: 22px; font-weight: 600;">${titleText}</h2>
                                <p style="margin: 0 0 24px 0; color: #665b5b; font-size: 15px; line-height: 1.6;">
                                    ${name ? `Hello <strong>${name}</strong>,<br/>` : 'Hello,'}
                                    Use the verification code below to complete ${actionText} at <strong>Joyfulmarts</strong>.
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
                                <p style="margin: 0;">&copy; ${new Date().getFullYear()} Joyfulmarts. All Rights Reserved.</p>
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
        from: `"Joyfulmarts (Joyfulmarts)" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: `${otp} is your ${titleText} - Joyfulmarts`,
        html: htmlContent
    };

    return await transporter.sendMail(mailOptions);
}

/**
 * Send Order Confirmation Email (Order Placed Successfully)
 * @param {object} order - Mongoose Order Document
 */
async function sendOrderConfirmationEmail(order) {
    const toEmail = (order.user?.email || order.shippingAddress?.email || '').trim().toLowerCase();
    if (!toEmail) {
        console.warn('Cannot send order confirmation: No recipient email on order', order.orderId);
        return;
    }

    const customerName = order.shippingAddress?.fullName || order.user?.name || 'Valued Customer';
    const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const itemsHtml = (order.items || []).map(item => `
        <tr>
            <td style="padding: 14px 0; border-bottom: 1px solid #f0e9e2;">
                <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td width="60" style="vertical-align: top;">
                            <img src="${getEmailImageUrl(item.image)}" alt="${item.name}" width="54" height="66" style="border-radius: 6px; object-fit: cover; border: 1px solid #eae3dc; display: block;" />
                        </td>
                        <td style="padding-left: 14px; vertical-align: top;">
                            <div style="font-weight: 600; font-size: 14px; color: #1e1919; line-height: 1.4;">${item.name}</div>
                            <div style="font-size: 12px; color: #8c7b6d; margin-top: 4px;">
                                ${item.size ? `Size: <strong>${item.size}</strong> &bull; ` : ''}
                                ${item.color ? `Color: <strong>${item.color}</strong> &bull; ` : ''}
                                Qty: <strong>${item.quantity}</strong>
                            </div>
                        </td>
                        <td align="right" style="vertical-align: top; white-space: nowrap;">
                            <div style="font-weight: 700; font-size: 14px; color: #1e1919;">
                                ₹${((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    `).join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmed #${order.orderId}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2d2626;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f7f5f2; padding: 36px 0;">
            <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #eae3dc;">
                        
                        <!-- Header -->
                        <tr>
                            <td align="center" style="background-color: #1e1919; padding: 32px 20px;">
                                <div style="color: #d4af37; font-size: 12px; letter-spacing: 3px; font-weight: 600; text-transform: uppercase; margin-bottom: 6px;">✦ Joyfulmarts FASHION ✦</div>
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;">Joyfulmarts</h1>
                                <p style="color: #a89f91; margin: 4px 0 0 0; font-size: 11px; letter-spacing: 2px;">TRADITION MEETS TREND</p>
                            </td>
                        </tr>

                        <!-- Banner / Welcome -->
                        <tr>
                            <td style="padding: 34px 32px 20px 32px;">
                                <div style="display: inline-block; background-color: #e6f7ec; color: #027a48; border: 1px solid #a6f4c5; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; padding: 6px 14px; border-radius: 20px; text-transform: uppercase; margin-bottom: 16px;">
                                    ✔ Order Confirmed
                                </div>
                                <h2 style="margin: 0 0 10px 0; color: #1e1919; font-size: 22px; font-weight: 700;">
                                    Thank you for your order, ${customerName}!
                                </h2>
                                <p style="margin: 0; color: #665b5b; font-size: 14px; line-height: 1.6;">
                                    We have received your order <strong>#${order.orderId}</strong> and are currently preparing it for dispatch. We will notify you once it's out for delivery.
                                </p>
                            </td>
                        </tr>

                        <!-- Order Summary Card -->
                        <tr>
                            <td style="padding: 0 32px 24px 32px;">
                                <div style="background-color: #faf7f4; border: 1px solid #ebd8d4; border-radius: 10px; padding: 18px 20px;">
                                    <table cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td style="padding: 4px 0; font-size: 13px; color: #7a6e6e;">Order Number:</td>
                                            <td align="right" style="padding: 4px 0; font-size: 13px; font-weight: 700; color: #1e1919;">#${order.orderId}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 4px 0; font-size: 13px; color: #7a6e6e;">Order Date:</td>
                                            <td align="right" style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #1e1919;">${orderDate}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 4px 0; font-size: 13px; color: #7a6e6e;">Payment Method:</td>
                                            <td align="right" style="padding: 4px 0; font-size: 13px; font-weight: 700; color: #1e1919;">
                                                ${order.paymentMethod === 'Online' ? 'Online (Paid)' : 'Cash on Delivery (COD)'}
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </td>
                        </tr>

                        <!-- Items Section -->
                        <tr>
                            <td style="padding: 0 32px 10px 32px;">
                                <div style="font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #8c7b6d; margin-bottom: 12px; border-bottom: 2px solid #ebd8d4; padding-bottom: 8px;">
                                    Items In Your Order
                                </div>
                                <table cellpadding="0" cellspacing="0" width="100%">
                                    ${itemsHtml}
                                </table>
                            </td>
                        </tr>

                        <!-- Cost Breakdown -->
                        <tr>
                            <td style="padding: 10px 32px 24px 32px;">
                                <table cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; color: #554848;">
                                    <tr>
                                        <td style="padding: 6px 0;">Subtotal:</td>
                                        <td align="right" style="padding: 6px 0; font-weight: 600;">₹${Number(order.subtotal || 0).toLocaleString('en-IN')}</td>
                                    </tr>
                                    ${order.discount > 0 ? `
                                    <tr>
                                        <td style="padding: 6px 0; color: #16a34a;">Coupon Discount:</td>
                                        <td align="right" style="padding: 6px 0; font-weight: 700; color: #16a34a;">-₹${Number(order.discount).toLocaleString('en-IN')}</td>
                                    </tr>` : ''}
                                    <tr>
                                        <td style="padding: 6px 0;">Shipping:</td>
                                        <td align="right" style="padding: 6px 0; font-weight: 600;">
                                            ${order.shippingFee > 0 ? `₹${Number(order.shippingFee).toLocaleString('en-IN')}` : '<span style="color: #16a34a; font-weight: 700;">FREE</span>'}
                                        </td>
                                    </tr>
                                    <tr style="border-top: 1px dashed #ebd8d4;">
                                        <td style="padding: 12px 0; font-size: 16px; font-weight: 800; color: #1e1919;">Total Amount:</td>
                                        <td align="right" style="padding: 12px 0; font-size: 18px; font-weight: 800; color: #1e1919;">₹${Number(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Delivery Address Card -->
                        <tr>
                            <td style="padding: 0 32px 30px 32px;">
                                <div style="background-color: #faf7f5; border: 1px solid #ebd8d4; border-radius: 10px; padding: 18px 20px;">
                                    <div style="font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: 1.2px; color: #8c7b6d; margin-bottom: 8px;">
                                        📦 Delivery Address
                                    </div>
                                    <div style="font-weight: 700; font-size: 14px; color: #1e1919;">${order.shippingAddress?.fullName}</div>
                                    <div style="font-size: 13px; color: #554848; line-height: 1.5; margin-top: 4px;">
                                        ${order.shippingAddress?.address}<br/>
                                        ${order.shippingAddress?.city ? `${order.shippingAddress.city}, ` : ''}${order.shippingAddress?.state || ''} - <strong>${order.shippingAddress?.pincode}</strong><br/>
                                        Phone: <strong>${order.shippingAddress?.phone}</strong>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <!-- Customer Support Footer -->
                        <tr>
                            <td style="background-color: #faf7f5; border-top: 1px solid #f0e9e2; padding: 24px 32px; text-align: center; color: #9c8f84; font-size: 12px; line-height: 1.6;">
                                <p style="margin: 0 0 6px 0; color: #665b5b; font-weight: 600;">
                                    Questions about your order? We are here to help!
                                </p>
                                <p style="margin: 0 0 6px 0;">
                                    Support Email: <a href="mailto:${process.env.SMTP_USER}" style="color: #ed4765; text-decoration: none;">${process.env.SMTP_USER}</a> &bull; WhatsApp Support Available
                                </p>
                                <p style="margin: 0;">&copy; ${new Date().getFullYear()} Joyfulmarts. All Rights Reserved.</p>
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
        from: `"Joyfulmarts (Joyfulmarts)" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: `Order Confirmed: #${order.orderId} - Joyfulmarts`,
        html: htmlContent
    };

    return await transporter.sendMail(mailOptions);
}

/**
 * Send Order Delivered Email
 * @param {object} order - Mongoose Order Document
 */
async function sendOrderDeliveredEmail(order) {
    const toEmail = (order.user?.email || order.shippingAddress?.email || '').trim().toLowerCase();
    if (!toEmail) {
        console.warn('Cannot send delivered email: No recipient email on order', order.orderId);
        return;
    }

    const customerName = order.shippingAddress?.fullName || order.user?.name || 'Valued Customer';
    const deliveryDate = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const itemsHtml = (order.items || []).map(item => `
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0e9e2;">
                <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td width="54" style="vertical-align: top;">
                            <img src="${getEmailImageUrl(item.image)}" alt="${item.name}" width="50" height="60" style="border-radius: 6px; object-fit: cover; border: 1px solid #eae3dc; display: block;" />
                        </td>
                        <td style="padding-left: 12px; vertical-align: top;">
                            <div style="font-weight: 600; font-size: 14px; color: #1e1919; line-height: 1.4;">${item.name}</div>
                            <div style="font-size: 12px; color: #8c7b6d; margin-top: 3px;">
                                ${item.size ? `Size: ${item.size} &bull; ` : ''} Qty: ${item.quantity}
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    `).join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Delivered #${order.orderId}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2d2626;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f7f5f2; padding: 36px 0;">
            <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #eae3dc;">
                        
                        <!-- Header -->
                        <tr>
                            <td align="center" style="background-color: #1e1919; padding: 32px 20px;">
                                <div style="color: #d4af37; font-size: 12px; letter-spacing: 3px; font-weight: 600; text-transform: uppercase; margin-bottom: 6px;">✦ Joyfulmarts FASHION ✦</div>
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;">Joyfulmarts</h1>
                                <p style="color: #a89f91; margin: 4px 0 0 0; font-size: 11px; letter-spacing: 2px;">TRADITION MEETS TREND</p>
                            </td>
                        </tr>

                        <!-- Banner / Delivered Celebration -->
                        <tr>
                            <td style="padding: 34px 32px 20px 32px; text-align: center;">
                                <div style="display: inline-block; background-color: #e6f7ec; color: #027a48; border: 1px solid #a6f4c5; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; padding: 6px 16px; border-radius: 20px; text-transform: uppercase; margin-bottom: 16px;">
                                    🎉 Package Delivered
                                </div>
                                <h2 style="margin: 0 0 10px 0; color: #1e1919; font-size: 24px; font-weight: 700;">
                                    Your Order Has Been Delivered!
                                </h2>
                                <p style="margin: 0; color: #665b5b; font-size: 15px; line-height: 1.6;">
                                    Hello <strong>${customerName}</strong>, your package for order <strong>#${order.orderId}</strong> was delivered on <strong>${deliveryDate}</strong>.
                                </p>
                            </td>
                        </tr>

                        <!-- Items Delivered Section -->
                        <tr>
                            <td style="padding: 0 32px 20px 32px;">
                                <div style="background-color: #faf7f5; border: 1px solid #ebd8d4; border-radius: 10px; padding: 18px 20px;">
                                    <div style="font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; color: #8c7b6d; margin-bottom: 10px;">
                                        Delivered Items
                                    </div>
                                    <table cellpadding="0" cellspacing="0" width="100%">
                                        ${itemsHtml}
                                    </table>
                                </div>
                            </td>
                        </tr>

                        <!-- Review & Feedback CTA -->
                        <tr>
                            <td style="padding: 10px 32px 26px 32px; text-align: center;">
                                <div style="background: linear-gradient(135deg, #fff7f8 0%, #fff0f2 100%); border: 1px solid #ffd8de; border-radius: 10px; padding: 22px 20px;">
                                    <h3 style="margin: 0 0 8px 0; color: #1e1919; font-size: 17px; font-weight: 700;">
                                        How Did You Like Your Outfit?
                                    </h3>
                                    <p style="margin: 0 0 16px 0; color: #665b5b; font-size: 13px; line-height: 1.5;">
                                        Your review helps fellow fashion lovers make the right choice and helps us improve!
                                    </p>
                                    <a href="http://localhost:5173/dashboard" style="background-color: #1e1919; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; padding: 11px 26px; border-radius: 6px; display: inline-block;">
                                        Write a Verified Review &rarr;
                                    </a>
                                </div>
                            </td>
                        </tr>

                        <!-- Return & Exchange Notice -->
                        <tr>
                            <td style="padding: 0 32px 30px 32px;">
                                <div style="border-left: 3px solid #d4af37; background-color: #fcfbf9; padding: 14px 18px; border-radius: 0 8px 8px 0; font-size: 12px; color: #665b5b; line-height: 1.6;">
                                    <strong>7-Day Easy Returns & Exchange:</strong><br/>
                                    If the size doesn't fit or you need any assistance, you can easily raise a return or exchange request directly from your <strong>User Dashboard &gt; Return Request</strong>.
                                </div>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #faf7f5; border-top: 1px solid #f0e9e2; padding: 24px 32px; text-align: center; color: #9c8f84; font-size: 12px; line-height: 1.6;">
                                <p style="margin: 0 0 6px 0;">Thank you for being a valued part of the Joyfulmarts family.</p>
                                <p style="margin: 0;">&copy; ${new Date().getFullYear()} Joyfulmarts. All Rights Reserved.</p>
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
        from: `"Joyfulmarts (Joyfulmarts)" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: `Delivered! Your Joyfulmarts Order #${order.orderId} Has Arrived 🎉`,
        html: htmlContent
    };

    return await transporter.sendMail(mailOptions);
}

module.exports = {
    transporter,
    sendOtpEmail,
    sendOrderConfirmationEmail,
    sendOrderDeliveredEmail
};
