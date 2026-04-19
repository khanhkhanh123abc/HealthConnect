import { VNPay, VnpLocale, VnpTransactionType } from 'vnpay';
import moment from 'moment-timezone';

const vnpay = new VNPay({
    tmnCode: process.env.VNPAY_TMN_CODE,
    secureSecret: process.env.VNPAY_HASH_SECRET,
    vnpayHost: process.env.VNPAY_HOST || 'https://sandbox.vnpayment.vn',
    testMode: true,
});

const getVNTime = () => moment().tz('Asia/Ho_Chi_Minh');
const formatVNPayDate = (momentObj) => momentObj.format('YYYYMMDDHHmmss');


// ================= CREATE PAYMENT =================
const createPaymentUrl = async (bookingId, amount, ipAddr) => {
    try {
        const txnRef = `HC${bookingId}${Date.now()}`;
        const createDate = getVNTime();
        const expireDate = getVNTime().add(15, 'minutes');

        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: amount,
            vnp_IpAddr: ipAddr,
            vnp_TxnRef: txnRef,
            vnp_OrderInfo: `Thanh toan lich kham #${bookingId}`,
            vnp_OrderType: 'other',
            vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: formatVNPayDate(createDate),
            vnp_ExpireDate: formatVNPayDate(expireDate),
        });

        return { errCode: 0, paymentUrl, txnRef };
    } catch (e) {
        console.error('createPaymentUrl error:', e);
        throw e;
    }
};


// ================= SAVE TRANSACTION =================
const saveVNPayTransaction = async (booking, vnpParams) => {
    try {
        booking.vnpTransactionNo = vnpParams['vnp_TransactionNo'] || '';
        booking.vnpTransactionDate = vnpParams['vnp_PayDate'] || '';
        booking.vnpTxnRef = vnpParams['vnp_TxnRef'] || ''; // ✅ FIX QUAN TRỌNG

        const vnpAmount = parseInt(vnpParams['vnp_Amount'] || '0');
        booking.price = Math.round(vnpAmount / 100);

        await booking.save();

        console.log(`[VNPay] Saved transaction for booking #${booking.id}`, {
            txnRef: booking.vnpTxnRef,
            transactionNo: booking.vnpTransactionNo,
            payDate: booking.vnpTransactionDate
        });

    } catch (e) {
        console.error('[VNPay] save transaction error:', e);
    }
};


// ================= HANDLE IPN =================
const handleVNPayIPN = async (vnpParams) => {
    try {
        const db = require('../models/index').default || require('../models/index');
        const verify = vnpay.verifyIpnCall(vnpParams);

        if (!verify.isVerified) return { RspCode: '97', Message: 'Invalid checksum' };
        if (!verify.isSuccess) return { RspCode: '00', Message: 'Transaction failed' };

        const txnRef = vnpParams['vnp_TxnRef'];
        const match = txnRef?.match(/^HC(\d+)\d{13}$/);
        if (!match) return { RspCode: '01', Message: 'Order not found' };

        const bookingId = parseInt(match[1]);
        const BookingModel = db.Booking || db.Bookings;

        const booking = await BookingModel.findOne({
            where: { id: bookingId },
            raw: false
        });

        if (!booking) return { RspCode: '01', Message: 'Order not found' };

        // tránh xử lý lại
        if (booking.statusId === 'S2' && booking.vnpTransactionNo) {
            return { RspCode: '00', Message: 'Already confirmed' };
        }

        booking.statusId = 'S2';
        await saveVNPayTransaction(booking, vnpParams);

        console.log(`[IPN] Booking #${bookingId} confirmed`);

        return { RspCode: '00', Message: 'Confirm success' };

    } catch (e) {
        console.error('handleVNPayIPN error:', e);
        return { RspCode: '99', Message: 'Unknown error' };
    }
};


// ================= HANDLE RETURN =================
const handleVNPayReturn = async (vnpParams) => {
    try {
        const verify = vnpay.verifyReturnUrl(vnpParams);

        if (!verify.isVerified || !verify.isSuccess) {
            return { errCode: 1, message: 'Thanh toán thất bại!' };
        }

        const txnRef = vnpParams['vnp_TxnRef'];
        const match = txnRef?.match(/^HC(\d+)\d{13}$/);

        if (!match) {
            return { errCode: 1, message: 'TxnRef không hợp lệ!' };
        }

        const bookingId = parseInt(match[1]);
        const db = require('../models/index').default || require('../models/index');
        const BookingModel = db.Booking || db.Bookings;

        const booking = await BookingModel.findOne({
            where: { id: bookingId },
            raw: false
        });

        if (!booking) {
            return { errCode: 1, message: 'Không tìm thấy booking!' };
        }

        // Nếu chưa confirm → confirm
        if (booking.statusId === 'S1') {
            booking.statusId = 'S2';
            await saveVNPayTransaction(booking, vnpParams);
            console.log(`[RETURN] Confirm booking #${bookingId}`);
        }

        // Nếu đã confirm nhưng thiếu data → bổ sung
        else if (booking.statusId === 'S2' && !booking.vnpTransactionNo) {
            await saveVNPayTransaction(booking, vnpParams);
            console.log(`[RETURN] Backfill transaction for #${bookingId}`);
        }

        return { errCode: 0, message: 'Thanh toán thành công!' };

    } catch (e) {
        console.error('handleVNPayReturn error:', e);
        throw e;
    }
};


// ================= REFUND =================
const createRefund = async (booking) => {
    try {
        if (!booking.vnpTransactionNo || !booking.vnpTransactionDate || !booking.vnpTxnRef) {
            return {
                success: false,
                message: 'Thiếu dữ liệu VNPay (TxnRef / TransactionNo / Date)'
            };
        }

        const now = getVNTime();

        const result = await vnpay.refund({
            vnp_Amount: booking.price,
            vnp_TransactionType: VnpTransactionType.FULL_REFUND,
            vnp_TxnRef: booking.vnpTxnRef,
            vnp_TransactionNo: booking.vnpTransactionNo,
            vnp_TransactionDate: booking.vnpTransactionDate,
            vnp_CreateBy: 'HealthConnect',
            vnp_CreateDate: formatVNPayDate(now),
            vnp_IpAddr: '127.0.0.1',
            vnp_OrderInfo: `Hoan tien lich kham #${booking.id}`,
            vnp_RequestId: `RF${booking.id}_${Date.now()}`,
        });

        console.log('[Refund] Response:', result);

        if (result?.vnp_ResponseCode === '00' || result?.isSuccess) {
            return {
                success: true,
                refundAmount: booking.price
            };
        }

        return {
            success: false,
            message: result?.vnp_Message || 'Refund failed'
        };

    } catch (e) {
        console.error('[Refund ERROR]', e);
        return {
            success: false,
            message: e.message
        };
    }
};


module.exports = {
    createPaymentUrl,
    handleVNPayIPN,
    handleVNPayReturn,
    createRefund
};