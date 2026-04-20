const paypal = require('@paypal/checkout-server-sdk');
const db = require('../models');

let environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);

let client = new paypal.core.PayPalHttpClient(environment);

// Tạo order và trả về approvalUrl để redirect user đến PayPal
let createPaypalOrder = async (bookingId, amountUsd) => {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const amount = parseFloat(amountUsd);
    if (!amount || amount <= 0) {
        console.error(`[PayPal] Invalid amountUsd=${amountUsd} for bookingId=${bookingId}`);
        return { errCode: 1, errMessage: 'Số tiền thanh toán không hợp lệ!' };
    }

    try {
        let request = new paypal.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
            intent: 'CAPTURE',
            application_context: {
                brand_name: 'HealthConnect',
                user_action: 'PAY_NOW',
                return_url: `${backendUrl}/api/paypal-return?bookingId=${bookingId}`,
                cancel_url: `${frontendUrl}/payment-result?status=cancelled`,
            },
            purchase_units: [{
                reference_id: bookingId.toString(),
                description: `HealthConnect - Booking #${bookingId}`,
                amount: {
                    currency_code: 'USD',
                    value: amount.toFixed(2)
                }
            }]
        });

        console.log(`[PayPal] Calling PayPal API — bookingId=${bookingId}, amount=$${amount.toFixed(2)}`);
        let response = await client.execute(request);
        let order = response.result;
        let approvalUrl = order.links.find(l => l.rel === 'approve')?.href;

        console.log(`[PayPal] Order created — orderId=${order.id}, status=${order.status}`);
        return { errCode: 0, orderID: order.id, approvalUrl };
    } catch (err) {
        console.error('[PayPal] client.execute error:', err?.message || err);
        if (err?.statusCode) console.error('[PayPal] HTTP status:', err.statusCode);
        if (err?.result) console.error('[PayPal] response body:', JSON.stringify(err.result));
        throw err;
    }
};

// Capture order sau khi user approve trên PayPal và redirect về
let handlePaypalReturn = async (token, bookingId) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    try {
        let request = new paypal.orders.OrdersCaptureRequest(token);
        request.requestBody({});

        let response = await client.execute(request);
        let capture = response.result;

        if (capture.status !== 'COMPLETED') {
            return { errCode: 1, redirectUrl: `${frontendUrl}/payment-result?status=failed` };
        }

        let captureDetail = capture.purchase_units[0].payments.captures[0];

        let booking = await db.Booking.findOne({ where: { id: bookingId }, raw: false });
        if (!booking) {
            return { errCode: 2, redirectUrl: `${frontendUrl}/payment-result?status=failed` };
        }

        booking.statusId = 'S2';
        booking.vnpTxnRef = token;
        booking.vnpTransactionNo = captureDetail.id;
        booking.vnpTransactionDate = new Date().toISOString();
        await booking.save();

        return { errCode: 0, redirectUrl: `${frontendUrl}/payment-result?status=success` };
    } catch (err) {
        console.error('PayPal capture error:', err);
        return { errCode: -1, redirectUrl: `${frontendUrl}/payment-result?status=error` };
    }
};

// Hoàn tiền PayPal khi hủy lịch
let createRefund = async (booking) => {
    try {
        if (!booking.vnpTransactionNo) {
            return { success: false, message: 'Không có thông tin giao dịch PayPal để hoàn tiền' };
        }

        let request = new paypal.payments.CapturesRefundRequest(booking.vnpTransactionNo);
        request.requestBody({
            note_to_payer: 'Hoàn tiền hủy lịch hẹn HealthConnect'
        });

        let response = await client.execute(request);

        if (response.result.status === 'COMPLETED') {
            return { success: true, refundAmount: booking.price, isPending: false };
        }
        if (response.result.status === 'PENDING') {
            return { success: true, refundAmount: booking.price, isPending: true };
        }
        return { success: false, message: `Hoàn tiền thất bại: ${response.result.status}` };
    } catch (err) {
        console.error('PayPal refund error:', err);
        return { success: false, message: err.message || 'Lỗi hoàn tiền PayPal' };
    }
};

module.exports = { createPaypalOrder, handlePaypalReturn, createRefund };
