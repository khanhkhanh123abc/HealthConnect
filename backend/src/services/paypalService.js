const paypal = require('@paypal/checkout-server-sdk');
const db = require('../models');
const logger = require('../utils/logger').default || require('../utils/logger');

let environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);

let client = new paypal.core.PayPalHttpClient(environment);

// Internal: resolve a doctor's authoritative price by joining
// Doctor_Info → allCode (type='PRICE'). Returns numeric USD or null.
const resolveDoctorPriceUsd = async (doctorId) => {
    const info = await db.Doctor_Info.findOne({ where: { doctorId }, raw: true });
    if (!info?.priceId) return null;

    const code = await db.allCode.findOne({
        where: { keyMap: info.priceId, type: 'PRICE' },
        raw: true
    });
    if (!code?.value) return null;

    // value examples: "$50", "50.00", "50 USD", "1,000,000 VND". Strip non-numeric.
    const cleaned = String(code.value).replace(/[^\d.]/g, '');
    const parsed = parseFloat(cleaned);
    if (!Number.isFinite(parsed) || parsed <= 0) return null;
    return parsed;
};

// Create order. The client cannot influence the amount — server resolves it
// from the booking → doctor → price chain. Caller (controller) must confirm
// req.user.id === booking.patientId before invoking.
let createPaypalOrder = async (bookingId) => {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    if (!bookingId) return { errCode: 1, errMessage: 'Missing bookingId' };

    const BookingModel = db.Booking || db.Bookings;
    const booking = await BookingModel.findOne({ where: { id: bookingId }, raw: true });
    if (!booking) return { errCode: 2, errMessage: 'Booking not found' };

    if (!['S1', 'S2'].includes(booking.statusId)) {
        return { errCode: 3, errMessage: 'Booking is not payable in its current state' };
    }

    const amount = await resolveDoctorPriceUsd(booking.doctorId);
    if (!amount) {
        logger.error({ bookingId, doctorId: booking.doctorId }, '[PayPal] cannot resolve price');
        return { errCode: 4, errMessage: 'Price unavailable for this doctor' };
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

        let response = await client.execute(request);
        let order = response.result;
        let approvalUrl = order.links.find(l => l.rel === 'approve')?.href;

        // Persist authoritative price on the booking so any later refund uses
        // the same number (avoids re-querying allCode if it has drifted).
        await BookingModel.update(
            { price: Math.round(amount) },
            { where: { id: bookingId } }
        );

        return { errCode: 0, orderID: order.id, approvalUrl };
    } catch (err) {
        logger.error({ err, statusCode: err?.statusCode, result: err?.result }, '[PayPal] client.execute error');
        throw err;
    }
};

// Capture order after user approval and persist transaction details.
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

        const BookingModel = db.Booking || db.Bookings;
        let booking = await BookingModel.findOne({ where: { id: bookingId }, raw: false });
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
        logger.error({ err }, 'PayPal capture error');
        return { errCode: -1, redirectUrl: `${frontendUrl}/payment-result?status=error` };
    }
};

// Refund a captured payment in full.
let createRefund = async (booking) => {
    try {
        if (!booking.vnpTransactionNo) {
            return { success: false, message: 'Missing PayPal transaction reference; cannot refund.' };
        }

        let request = new paypal.payments.CapturesRefundRequest(booking.vnpTransactionNo);
        request.requestBody({
            note_to_payer: 'Refund for cancelled HealthConnect appointment'
        });

        let response = await client.execute(request);

        if (response.result.status === 'COMPLETED') {
            return { success: true, refundAmount: booking.price, isPending: false };
        }
        if (response.result.status === 'PENDING') {
            return { success: true, refundAmount: booking.price, isPending: true };
        }
        return { success: false, message: `Refund failed: ${response.result.status}` };
    } catch (err) {
        logger.error({ err }, 'PayPal refund error');
        return { success: false, message: err.message || 'PayPal refund error' };
    }
};

module.exports = { createPaypalOrder, handlePaypalReturn, createRefund, resolveDoctorPriceUsd };
