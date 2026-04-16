import { VNPay, VnpLocale, dateFormat } from 'vnpay';
import moment from 'moment-timezone';

const vnpay = new VNPay({
    tmnCode: process.env.VNPAY_TMN_CODE,
    secureSecret: process.env.VNPAY_HASH_SECRET,
    vnpayHost: process.env.VNPAY_HOST || 'https://sandbox.vnpayment.vn',
    testMode: true,
});

// ===== Helper: lấy giờ VN (GMT+7) =====
const getVNTime = () => moment().tz('Asia/Ho_Chi_Minh');

// ===== 1. Tạo URL thanh toán =====
const createPaymentUrl = async (bookingId, amount, ipAddr) => {
    try {
        const txnRef = `HC${bookingId}${Date.now()}`;

        const createDate = getVNTime();
        const expireDate = getVNTime().add(15, 'minutes');

        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: amount, // thư viện tự nhân 100
            vnp_IpAddr: ipAddr,
            vnp_TxnRef: txnRef,
            vnp_OrderInfo: `Thanh toan lich kham #${bookingId}`,
            vnp_OrderType: 'other',
            vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(createDate.toDate()),
            vnp_ExpireDate: dateFormat(expireDate.toDate()),
        });

        return { errCode: 0, paymentUrl, txnRef };
    } catch (e) {
        console.error('createPaymentUrl error:', e);
        throw e;
    }
};

// ===== 2. Xử lý IPN =====
const handleVNPayIPN = async (vnpParams) => {
    try {
        const db = require('../models/index').default || require('../models/index');
        const { sendBankTransferConfirmedEmail } = require('./emailService');

        // 1. Verify chữ ký
        const verify = vnpay.verifyIpnCall(vnpParams);

        if (!verify.isVerified) {
            return { RspCode: '97', Message: 'Invalid checksum' };
        }

        if (!verify.isSuccess) {
            return { RspCode: '00', Message: 'Transaction failed' };
        }

        // 2. Parse bookingId
        const txnRef = vnpParams['vnp_TxnRef'];
        const match = txnRef.match(/^HC(\d+)\d{13}$/);

        if (!match) {
            return { RspCode: '01', Message: 'Order not found' };
        }

        const bookingId = parseInt(match[1]);

        // 3. Tìm booking
        const BookingModel = db.Booking || db.Bookings;

        const booking = await BookingModel.findOne({
            where: { id: bookingId }
        });

        if (!booking) {
            return { RspCode: '01', Message: 'Order not found' };
        }

        // 4. Nếu đã confirm thì bỏ qua (tránh duplicate)
        if (booking.statusId === 'S2') {
            return { RspCode: '00', Message: 'Already confirmed' };
        }

        // 5. Update trạng thái
        booking.statusId = 'S2';
        await booking.save();

        // 6. Gửi email (non-blocking)
        (async () => {
            try {
                const patient = await db.User.findOne({
                    where: { id: booking.patientId },
                    attributes: ['firstName', 'lastName', 'email'],
                    raw: true
                });

                const doctor = await db.User.findOne({
                    where: { id: booking.doctorId },
                    attributes: ['firstName', 'lastName'],
                    raw: true
                });

                const timeTypeData = await db.allCode.findOne({
                    where: { keyMap: booking.timeType, type: 'TIME' },
                    attributes: ['value'],
                    raw: true
                });

                const DAY_LABELS = [
                    'Chủ nhật', 'Thứ 2', 'Thứ 3',
                    'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'
                ];

                const d = moment(booking.date).tz('Asia/Ho_Chi_Minh');

                const dateStr = `${DAY_LABELS[d.day()]}, ${d.date()}/${d.month() + 1}/${d.year()}`;

                await sendBankTransferConfirmedEmail({
                    patientEmail: patient?.email,
                    patientName: `${patient?.lastName || ''} ${patient?.firstName || ''}`.trim(),
                    doctorName: `BS. ${doctor?.lastName || ''} ${doctor?.firstName || ''}`.trim(),
                    timeValue: timeTypeData?.value || booking.timeType,
                    dateStr,
                });

            } catch (e) {
                console.error('IPN email error:', e.message);
            }
        })();

        // 7. Trả về cho VNPay
        return { RspCode: '00', Message: 'Confirm success' };

    } catch (e) {
        console.error('handleVNPayIPN error:', e);
        return { RspCode: '99', Message: 'Unknown error' };
    }
};

// ===== 3. Xử lý Return URL =====
const handleVNPayReturn = async (vnpParams) => {
    try {
        const verify = vnpay.verifyReturnUrl(vnpParams);

        if (verify.isVerified && verify.isSuccess) {
            return {
                errCode: 0,
                message: 'Thanh toán thành công!'
            };
        } else {
            return {
                errCode: 1,
                message: 'Thanh toán thất bại hoặc bị huỷ!'
            };
        }
    } catch (e) {
        console.error('handleVNPayReturn error:', e);
        throw e;
    }
};

module.exports = {
    createPaymentUrl,
    handleVNPayIPN,
    handleVNPayReturn
};