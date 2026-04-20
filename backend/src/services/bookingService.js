import db from '../models/index';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { sendBookingConfirmEmail, sendCancelEmail } from './emailService';
import { convertUsdToVnd } from './currencyService';
import { createRefund } from './paypalService';

const DAY_LABELS = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

const formatDate = (date) => {
    const d = new Date(date);
    return `${DAY_LABELS[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

let createBooking = (data) => {
    return new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            if (!data.doctorId || !data.date || !data.timeType || !data.patientId) {
                await t.rollback();
                resolve({ errCode: 1, errMessage: 'Thiếu thông tin đặt lịch!' });
                return;
            }

            let dateStart = new Date(+data.date);
            dateStart.setHours(0, 0, 0, 0);
            let dateEnd = new Date(+data.date);
            dateEnd.setHours(23, 59, 59, 999);

            let schedule = await db.Schedule.findOne({
                where: {
                    doctorId: data.doctorId,
                    date: { [Op.between]: [dateStart, dateEnd] },
                    timeType: data.timeType
                },
                lock: t.LOCK.UPDATE,
                transaction: t,
                raw: false
            });

            if (!schedule) {
                await t.rollback();
                resolve({ errCode: 2, errMessage: 'Khung giờ này không tồn tại!' });
                return;
            }
            if (schedule.currentNumber >= schedule.maxNumber) {
                await t.rollback();
                resolve({ errCode: 3, errMessage: 'Khung giờ này đã hết chỗ!' });
                return;
            }

            const BookingModel = db.Booking || db.Bookings;

            // Kiểm tra booking đang active (S1/S2) → không cho đặt trùng
            let activeBooking = await BookingModel.findOne({
                where: {
                    patientId: data.patientId,
                    doctorId: data.doctorId,
                    date: { [Op.between]: [dateStart, dateEnd] },
                    timeType: data.timeType,
                    statusId: { [Op.in]: ['S1', 'S2'] }
                },
                transaction: t
            });

            if (activeBooking) {
                await t.rollback();
                resolve({ errCode: 4, errMessage: 'Bạn đã đặt lịch khám cho khung giờ này rồi!' });
                return;
            }

            // Kiểm tra có booking đã hủy (S4) không → reuse thay vì insert mới
            let cancelledBooking = await BookingModel.findOne({
                where: {
                    patientId: data.patientId,
                    doctorId: data.doctorId,
                    date: { [Op.between]: [dateStart, dateEnd] },
                    timeType: data.timeType,
                    statusId: 'S4'
                },
                transaction: t,
                raw: false
            });

            const confirmToken = uuidv4();
            let savedBookingId; // ✅ FIX 1: khai báo đúng chỗ

            if (cancelledBooking) {
                // Update booking đã hủy → S1 mới
                cancelledBooking.statusId = 'S1';
                cancelledBooking.reason = data.reason || '';
                cancelledBooking.token = confirmToken;
                cancelledBooking.paymentMethod = data.paymentMethod || 'CASH';
                await cancelledBooking.save({ transaction: t });
                savedBookingId = cancelledBooking.id; // ✅ FIX 2: đúng tên biến
            } else {
                // Tạo booking mới
                const newBooking = await BookingModel.create({ // ✅ FIX 3: gán vào biến
                    statusId: 'S1',
                    doctorId: data.doctorId,
                    patientId: data.patientId,
                    date: new Date(+data.date),
                    timeType: data.timeType,
                    reason: data.reason || '',
                    token: confirmToken,
                    paymentMethod: data.paymentMethod || 'CASH'
                }, { transaction: t });
                savedBookingId = newBooking.id; // ✅ FIX 4: lấy id từ biến đúng
            }

            schedule.currentNumber += 1;
            await schedule.save({ transaction: t });
            await t.commit();

            // Lấy giá tiền từ DB (value lưu bằng VND) rồi convert sang USD cho PayPal
            let priceAmountVnd = 500000; // fallback
            let priceAmountUsd = 0;
            try {
                let doctorInfo = await db.Doctor_Info.findOne({
                    where: { doctorId: data.doctorId },
                    attributes: ['priceId'],
                    raw: true
                });
                if (doctorInfo?.priceId) {
                    let priceCode = await db.allCode.findOne({
                        where: { keyMap: doctorInfo.priceId, type: 'PRICE' },
                        attributes: ['value'],
                        raw: true
                    });
                    if (priceCode?.value) {
                        priceAmountUsd = parseFloat(priceCode.value);
                        priceAmountVnd = await convertUsdToVnd(priceAmountUsd);
                    }
                }
            } catch (priceErr) {
                console.error('Get price error:', priceErr.message);
            }
            console.log(`[Booking] bookingId=${savedBookingId} priceVnd=${priceAmountVnd} priceUsd=${priceAmountUsd.toFixed(4)}`);

            // ✅ FIX 5: chỉ resolve() 1 lần duy nhất, đầy đủ thông tin
            resolve({
                errCode: 0,
                errMessage: 'Đặt lịch thành công!',
                remainingSlots: schedule.maxNumber - schedule.currentNumber,
                token: confirmToken,
                bookingId: savedBookingId,
                amount: priceAmountVnd,
                amountUsd: priceAmountUsd,
            });

            // ===== GỬI EMAIL SAU KHI COMMIT (non-blocking) =====
            (async () => {
                try {
                    let patient = await db.User.findOne({
                        where: { id: data.patientId },
                        attributes: ['firstName', 'lastName', 'email'],
                        raw: true
                    });
                    let doctor = await db.User.findOne({
                        where: { id: data.doctorId },
                        attributes: ['firstName', 'lastName'],
                        raw: true
                    });
                    let timeTypeData = await db.allCode.findOne({
                        where: { keyMap: data.timeType, type: 'TIME' },
                        attributes: ['value'],
                        raw: true
                    });
                    let clinicName = '', clinicAddress = '';
                    let markdown = await db.Markdown.findOne({
                        where: { doctorId: data.doctorId },
                        attributes: ['clinicId'],
                        raw: true
                    });
                    if (markdown?.clinicId) {
                        let clinic = await db.Clinic.findOne({
                            where: { id: markdown.clinicId },
                            attributes: ['name', 'address'],
                            raw: true
                        });
                        clinicName = clinic?.name || '';
                        clinicAddress = clinic?.address || '';
                    }

                    const doctorName = doctor
                        ? `BS. ${doctor.lastName || ''} ${doctor.firstName || ''}`.trim()
                        : 'Bác sĩ';
                    const patientName = patient
                        ? `${patient.lastName || ''} ${patient.firstName || ''}`.trim()
                        : 'Bạn';
                    const timeValue = timeTypeData?.value || data.timeType;
                    const dateStr = formatDate(data.date);

                    if (data.paymentMethod === 'BANK') {
                        const { sendBankTransferPendingEmail } = require('./emailService');
                        await sendBankTransferPendingEmail({
                            patientEmail: patient?.email,
                            patientName,
                            doctorName,
                            timeValue,
                            dateStr,
                            clinicName,
                            clinicAddress,
                            reason: data.reason || '',
                            bookingToken: confirmToken,
                        });
                    } else {
                        const confirmLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/confirm-booking?token=${confirmToken}`;
                        await sendBookingConfirmEmail({
                            patientEmail: patient?.email,
                            patientName,
                            doctorName,
                            timeValue,
                            dateStr,
                            clinicName,
                            clinicAddress,
                            reason: data.reason || '',
                            confirmLink,
                        });
                    }
                } catch (emailErr) {
                    console.error('Email send failed (non-blocking):', emailErr.message);
                }
            })();

        } catch (e) {
            await t.rollback();
            if (e.name === 'SequelizeUniqueConstraintError') {
                resolve({ errCode: 4, errMessage: 'Bạn đã đặt lịch khám cho khung giờ này rồi!' });
            } else {
                console.error('createBooking error:', e);
                reject(e);
            }
        }
    });
};

// Xác nhận lịch qua link trong email
let confirmBookingByToken = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!token) {
                resolve({ errCode: 1, errMessage: 'Token không hợp lệ!' });
                return;
            }

            const BookingModel = db.Booking || db.Bookings;
            let booking = await BookingModel.findOne({
                where: { token },
                raw: false
            });

            if (!booking) {
                resolve({ errCode: 2, errMessage: 'Lịch hẹn không tồn tại hoặc link đã hết hiệu lực!' });
                return;
            }
            if (booking.statusId === 'S2') {
                resolve({ errCode: 0, errMessage: 'Lịch hẹn đã được xác nhận trước đó!', alreadyConfirmed: true });
                return;
            }
            if (booking.statusId === 'S4') {
                resolve({ errCode: 3, errMessage: 'Lịch hẹn này đã bị hủy!' });
                return;
            }

            booking.statusId = 'S2';
            await booking.save();

            resolve({ errCode: 0, errMessage: 'Xác nhận lịch khám thành công!' });
        } catch (e) {
            console.error('confirmBookingByToken error:', e);
            reject(e);
        }
    });
};

let getBookingsByPatient = (patientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!patientId) {
                resolve({ errCode: 1, errMessage: 'Missing required parameter' });
                return;
            }

            const BookingModel = db.Booking || db.Bookings;
            let bookings = await BookingModel.findAll({
                where: { patientId },
                order: [['date', 'DESC']],
                raw: true
            });

            let result = await Promise.all(bookings.map(async (booking) => {
                let doctor = await db.User.findOne({
                    where: { id: booking.doctorId },
                    attributes: ['firstName', 'lastName', 'image'],
                    raw: true
                });
                let timeTypeData = await db.allCode.findOne({
                    where: { keyMap: booking.timeType, type: 'TIME' },
                    attributes: ['value'],
                    raw: true
                });
                let clinicName = '', clinicAddress = '';
                try {
                    let markdown = await db.Markdown.findOne({
                        where: { doctorId: booking.doctorId },
                        attributes: ['clinicId'], raw: true
                    });
                    if (markdown?.clinicId) {
                        let clinic = await db.Clinic.findOne({
                            where: { id: markdown.clinicId },
                            attributes: ['name', 'address'], raw: true
                        });
                        clinicName = clinic?.name || '';
                        clinicAddress = clinic?.address || '';
                    }
                } catch (_e) { }

                return {
                    ...booking,
                    timeValue: timeTypeData?.value || booking.timeType,
                    doctorName: doctor
                        ? `BS. ${doctor.lastName || ''} ${doctor.firstName || ''}`.trim()
                        : 'Bác sĩ',
                    doctorImage: doctor?.image || '',
                    clinicName,
                    clinicAddress
                };
            }));

            resolve({ errCode: 0, data: result });
        } catch (e) {
            console.error('getBookingsByPatient error:', e);
            reject(e);
        }
    });
};

let cancelBooking = (bookingId, patientId) => {
    return new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            if (!bookingId || !patientId) {
                await t.rollback();
                return resolve({ errCode: 1, errMessage: 'Missing required parameters' });
            }

            const BookingModel = db.Booking || db.Bookings;

            let booking = await BookingModel.findOne({
                where: { id: bookingId, patientId },
                transaction: t,
                raw: false
            });

            if (!booking) {
                await t.rollback();
                return resolve({ errCode: 2, errMessage: 'Không tìm thấy lịch hẹn!' });
            }

            if (!['S1', 'S2'].includes(booking.statusId)) {
                await t.rollback();
                return resolve({ errCode: 3, errMessage: 'Không thể hủy lịch ở trạng thái này!' });
            }

            const isPaid = booking.statusId === 'S2' && booking.paymentMethod === 'BANK';

            let refundResult = null;

            // ===== CASE 1: ĐÃ THANH TOÁN → PHẢI REFUND =====
            if (isPaid) {
                refundResult = await createRefund(booking);

                if (!refundResult.success) {
                    await t.rollback();
                    return resolve({
                        errCode: 4,
                        errMessage: 'Hoàn tiền thất bại: ' + refundResult.message
                    });
                }

                // ✅ Refund OK → cập nhật trạng thái refund
                booking.refundAmount = refundResult.refundAmount || booking.price;
                booking.refundStatus = refundResult.isPending ? 'PENDING' : 'REFUNDED';
            }

            // ===== UPDATE BOOKING =====
            booking.statusId = 'S4';
            await booking.save({ transaction: t });

            // ===== TRẢ SLOT =====
            let dateStart = new Date(booking.date);
            dateStart.setHours(0, 0, 0, 0);

            let dateEnd = new Date(booking.date);
            dateEnd.setHours(23, 59, 59, 999);

            let schedule = await db.Schedule.findOne({
                where: {
                    doctorId: booking.doctorId,
                    date: { [Op.between]: [dateStart, dateEnd] },
                    timeType: booking.timeType
                },
                transaction: t,
                raw: false
            });

            if (schedule && schedule.currentNumber > 0) {
                schedule.currentNumber -= 1;
                await schedule.save({ transaction: t });
            }

            await t.commit();

            // ===== EMAIL (NON-BLOCKING) =====
            (async () => {
                try {
                    let patient = await db.User.findOne({
                        where: { id: patientId },
                        attributes: ['firstName', 'lastName', 'email'],
                        raw: true
                    });

                    let doctor = await db.User.findOne({
                        where: { id: booking.doctorId },
                        attributes: ['firstName', 'lastName'],
                        raw: true
                    });

                    let timeTypeData = await db.allCode.findOne({
                        where: { keyMap: booking.timeType, type: 'TIME' },
                        attributes: ['value'],
                        raw: true
                    });

                    const refundNote = isPaid
                        ? `\nSố tiền ${booking.refundAmount.toLocaleString('vi-VN')}đ đang được xử lý hoàn về tài khoản của bạn.`
                        : '';

                    await sendCancelEmail({
                        patientEmail: patient?.email,
                        patientName: `${patient?.lastName || ''} ${patient?.firstName || ''}`.trim(),
                        doctorName: `BS. ${doctor?.lastName || ''} ${doctor?.firstName || ''}`.trim(),
                        timeValue: timeTypeData?.value || booking.timeType,
                        dateStr: formatDate(booking.date),
                        refundNote
                    });

                } catch (e) {
                    console.error('Send cancel email error:', e.message);
                }
            })();

            // ===== RESPONSE =====
            let message = 'Hủy lịch thành công!';
            if (isPaid) {
                message += ' Yêu cầu hoàn tiền đã được gửi.';
            }

            return resolve({
                errCode: 0,
                errMessage: message,
                refundStatus: booking.refundStatus,
                refundAmount: booking.refundAmount
            });

        } catch (e) {
            await t.rollback();
            reject(e);
        }
    });
};

// ===== THÊM MỚI: Bác sĩ hủy lịch =====
let doctorCancelBooking = (bookingId, doctorId, cancelReason) => {
    return new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            if (!bookingId || !doctorId) {
                await t.rollback();
                return resolve({ errCode: 1, errMessage: 'Missing parameters' });
            }

            const BookingModel = db.Booking || db.Bookings;

            let booking = await BookingModel.findOne({
                where: { id: bookingId, doctorId },
                transaction: t,
                raw: false
            });

            if (!booking) {
                await t.rollback();
                return resolve({ errCode: 2, errMessage: 'Không tìm thấy lịch hẹn!' });
            }

            if (!['S1', 'S2'].includes(booking.statusId)) {
                await t.rollback();
                return resolve({ errCode: 3, errMessage: 'Không thể hủy lịch ở trạng thái này!' });
            }

            const isPaid = booking.statusId === 'S2' && booking.paymentMethod === 'BANK';

            let refundResult = null;

            // ===== REFUND =====
            if (isPaid) {
                refundResult = await createRefund(booking);

                if (!refundResult.success) {
                    await t.rollback();
                    return resolve({
                        errCode: 4,
                        errMessage: 'Hoàn tiền thất bại: ' + refundResult.message
                    });
                }

                booking.refundAmount = refundResult.refundAmount || booking.price;
                booking.refundStatus = refundResult.isPending ? 'PENDING' : 'REFUNDED';
            }

            // ===== HỦY LỊCH =====
            booking.statusId = 'S4';
            await booking.save({ transaction: t });

            // ===== TRẢ SLOT =====
            let dateStart = new Date(booking.date);
            dateStart.setHours(0, 0, 0, 0);

            let dateEnd = new Date(booking.date);
            dateEnd.setHours(23, 59, 59, 999);

            let schedule = await db.Schedule.findOne({
                where: {
                    doctorId: booking.doctorId,
                    date: { [Op.between]: [dateStart, dateEnd] },
                    timeType: booking.timeType
                },
                transaction: t,
                raw: false
            });

            if (schedule && schedule.currentNumber > 0) {
                schedule.currentNumber -= 1;
                await schedule.save({ transaction: t });
            }

            await t.commit();

            // ===== EMAIL =====
            (async () => {
                try {
                    let patient = await db.User.findOne({
                        where: { id: booking.patientId },
                        attributes: ['firstName', 'lastName', 'email'],
                        raw: true
                    });

                    let doctor = await db.User.findOne({
                        where: { id: doctorId },
                        attributes: ['firstName', 'lastName'],
                        raw: true
                    });

                    let timeTypeData = await db.allCode.findOne({
                        where: { keyMap: booking.timeType, type: 'TIME' },
                        attributes: ['value'],
                        raw: true
                    });

                    const refundNote = isPaid
                        ? `\nSố tiền ${booking.refundAmount.toLocaleString('vi-VN')}đ đang được xử lý hoàn về tài khoản của bạn.`
                        : '';

                    await sendCancelEmail({
                        patientEmail: patient?.email,
                        patientName: `${patient?.lastName || ''} ${patient?.firstName || ''}`.trim(),
                        doctorName: `BS. ${doctor?.lastName || ''} ${doctor?.firstName || ''}`.trim(),
                        timeValue: timeTypeData?.value || booking.timeType,
                        dateStr: formatDate(booking.date),
                        refundNote,
                        cancelReason: cancelReason || 'Bác sĩ hủy lịch'
                    });

                } catch (e) {
                    console.error('Doctor cancel email error:', e.message);
                }
            })();

            // ===== RESPONSE =====
            let message = 'Bác sĩ đã hủy lịch thành công!';
            if (isPaid) message += ' Yêu cầu hoàn tiền đã được gửi.';

            return resolve({
                errCode: 0,
                errMessage: message,
                refundStatus: booking.refundStatus,
                refundAmount: booking.refundAmount
            });

        } catch (e) {
            await t.rollback();
            reject(e);
        }
    });
};

let getScheduleWithSlots = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({ errCode: 1, errMessage: 'Missing parameters' });
                return;
            }
            let dateStart = new Date(+date);
            dateStart.setHours(0, 0, 0, 0);
            let dateEnd = new Date(+date);
            dateEnd.setHours(23, 59, 59, 999);

            let schedules = await db.Schedule.findAll({
                where: { doctorId, date: { [Op.between]: [dateStart, dateEnd] } },
                include: [{ model: db.allCode, as: 'timeTypeData', attributes: ['value', 'keyMap'] }],
                raw: false, nest: true
            });

            let result = schedules.map(s => ({
                timeType: s.timeType,
                timeValue: s.timeTypeData?.value || s.timeType,
                maxNumber: s.maxNumber,
                currentNumber: s.currentNumber,
                remainingSlots: s.maxNumber - s.currentNumber,
                isFull: s.currentNumber >= s.maxNumber
            }));

            resolve({ errCode: 0, data: result });
        } catch (e) {
            reject(e);
        }
    });
};

let getBookingsByDoctor = (doctorId, weekStart) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({ errCode: 1, errMessage: 'Missing doctorId' });
                return;
            }
            const startDate = weekStart
                ? new Date(+weekStart)
                : (() => {
                    const d = new Date();
                    const day = d.getDay();
                    const diff = day === 0 ? -6 : 1 - day;
                    d.setDate(d.getDate() + diff);
                    d.setHours(0, 0, 0, 0);
                    return d;
                })();
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);

            const BookingModel = db.Booking || db.Bookings;
            let bookings = await BookingModel.findAll({
                where: {
                    doctorId,
                    date: { [Op.between]: [startDate, endDate] },
                    statusId: { [Op.in]: ['S1', 'S2', 'S3'] }
                },
                order: [['date', 'ASC'], ['timeType', 'ASC']],
                raw: true
            });

            let result = await Promise.all(bookings.map(async (booking) => {
                let patient = await db.User.findOne({
                    where: { id: booking.patientId },
                    attributes: ['firstName', 'lastName', 'email', 'phoneNumber', 'gender', 'address', 'image'],
                    raw: true
                });
                let timeTypeData = await db.allCode.findOne({
                    where: { keyMap: booking.timeType, type: 'TIME' },
                    attributes: ['value'],
                    raw: true
                });
                return {
                    ...booking,
                    timeValue: timeTypeData?.value || booking.timeType,
                    patientName: patient
                        ? `${patient.lastName || ''} ${patient.firstName || ''}`.trim()
                        : 'Bệnh nhân',
                    patientEmail: patient?.email || '',
                    patientPhone: patient?.phoneNumber || '',
                    patientAddress: patient?.address || '',
                    patientImage: patient?.image || '',
                    reason: booking.reason || '',
                };
            }));

            resolve({ errCode: 0, data: result });
        } catch (e) {
            console.error('getBookingsByDoctor error:', e);
            reject(e);
        }
    });
};

let completeBooking = (bookingId, doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!bookingId || !doctorId) {
                resolve({ errCode: 1, errMessage: 'Missing parameters' });
                return;
            }
            const BookingModel = db.Booking || db.Bookings;
            let booking = await BookingModel.findOne({
                where: { id: bookingId, doctorId },
                raw: false
            });
            if (!booking) {
                resolve({ errCode: 2, errMessage: 'Không tìm thấy lịch hẹn!' });
                return;
            }
            if (booking.statusId !== 'S2') {
                resolve({ errCode: 3, errMessage: 'Chỉ có thể hoàn thành lịch đã xác nhận!' });
                return;
            }
            booking.statusId = 'S3';
            await booking.save();
            resolve({ errCode: 0, errMessage: 'Đã đánh dấu hoàn thành!' });
        } catch (e) {
            reject(e);
        }
    });
};

let sendMedicalRecord = (bookingId, doctorId, content) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!bookingId || !doctorId || !content) {
                resolve({ errCode: 1, errMessage: 'Missing parameters' });
                return;
            }
            const BookingModel = db.Booking || db.Bookings;
            let booking = await BookingModel.findOne({
                where: { id: bookingId, doctorId },
                raw: true
            });
            if (!booking) {
                resolve({ errCode: 2, errMessage: 'Không tìm thấy lịch hẹn!' });
                return;
            }
            let patient = await db.User.findOne({
                where: { id: booking.patientId },
                attributes: ['firstName', 'lastName', 'email'],
                raw: true
            });
            let doctor = await db.User.findOne({
                where: { id: doctorId },
                attributes: ['firstName', 'lastName'],
                raw: true
            });
            if (!patient?.email) {
                resolve({ errCode: 3, errMessage: 'Không tìm thấy email bệnh nhân!' });
                return;
            }
            const { sendMedicalRecordEmail } = require('./emailService');
            await sendMedicalRecordEmail({
                patientEmail: patient.email,
                patientName: `${patient.lastName || ''} ${patient.firstName || ''}`.trim(),
                doctorName: `BS. ${doctor?.lastName || ''} ${doctor?.firstName || ''}`.trim(),
                content,
                bookingId
            });
            resolve({ errCode: 0, errMessage: 'Đã gửi hồ sơ qua email!' });
        } catch (e) {
            reject(e);
        }
    });
};

let confirmPayment = (bookingId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!bookingId) {
                resolve({ errCode: 1, errMessage: 'Missing bookingId!' });
                return;
            }
            const BookingModel = db.Booking || db.Bookings;
            let booking = await BookingModel.findOne({
                where: { id: bookingId },
                raw: false
            });
            if (!booking) {
                resolve({ errCode: 2, errMessage: 'Không tìm thấy lịch hẹn!' });
                return;
            }
            if (booking.paymentMethod !== 'BANK') {
                resolve({ errCode: 3, errMessage: 'Lịch này không phải thanh toán chuyển khoản!' });
                return;
            }
            if (booking.statusId === 'S2') {
                resolve({ errCode: 0, errMessage: 'Lịch đã được xác nhận trước đó!', alreadyConfirmed: true });
                return;
            }
            if (booking.statusId === 'S4') {
                resolve({ errCode: 4, errMessage: 'Lịch đã bị hủy, không thể xác nhận!' });
                return;
            }

            booking.statusId = 'S2';
            await booking.save();

            (async () => {
                try {
                    let patient = await db.User.findOne({
                        where: { id: booking.patientId },
                        attributes: ['firstName', 'lastName', 'email'],
                        raw: true
                    });
                    let doctor = await db.User.findOne({
                        where: { id: booking.doctorId },
                        attributes: ['firstName', 'lastName'],
                        raw: true
                    });
                    let timeTypeData = await db.allCode.findOne({
                        where: { keyMap: booking.timeType, type: 'TIME' },
                        attributes: ['value'],
                        raw: true
                    });
                    const { sendBankTransferConfirmedEmail } = require('./emailService');
                    await sendBankTransferConfirmedEmail({
                        patientEmail: patient?.email,
                        patientName: `${patient?.lastName || ''} ${patient?.firstName || ''}`.trim(),
                        doctorName: `BS. ${doctor?.lastName || ''} ${doctor?.firstName || ''}`.trim(),
                        timeValue: timeTypeData?.value || booking.timeType,
                        dateStr: formatDate(booking.date),
                    });
                } catch (e) {
                    console.error('Email confirm payment failed:', e.message);
                }
            })();

            resolve({ errCode: 0, errMessage: 'Xác nhận thanh toán thành công! Lịch đã được chốt.' });
        } catch (e) {
            reject(e);
        }
    });
};

let getPendingBankBookings = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const BookingModel = db.Booking || db.Bookings;
            let bookings = await BookingModel.findAll({
                where: {
                    paymentMethod: 'BANK',
                    statusId: 'S1'
                },
                order: [['createdAt', 'ASC']],
                raw: true
            });

            let result = await Promise.all(bookings.map(async (booking) => {
                let patient = await db.User.findOne({
                    where: { id: booking.patientId },
                    attributes: ['firstName', 'lastName', 'email', 'phoneNumber'],
                    raw: true
                });
                let doctor = await db.User.findOne({
                    where: { id: booking.doctorId },
                    attributes: ['firstName', 'lastName'],
                    raw: true
                });
                let timeTypeData = await db.allCode.findOne({
                    where: { keyMap: booking.timeType, type: 'TIME' },
                    attributes: ['value'],
                    raw: true
                });
                return {
                    ...booking,
                    timeValue: timeTypeData?.value || booking.timeType,
                    patientName: patient ? `${patient.lastName || ''} ${patient.firstName || ''}`.trim() : 'Bệnh nhân',
                    patientEmail: patient?.email || '',
                    patientPhone: patient?.phoneNumber || '',
                    doctorName: doctor ? `BS. ${doctor.lastName || ''} ${doctor.firstName || ''}`.trim() : 'Bác sĩ',
                };
            }));

            resolve({ errCode: 0, data: result });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createBooking,
    confirmBookingByToken,
    getBookingsByPatient,
    cancelBooking,
    getPendingBankBookings,
    getScheduleWithSlots,
    confirmPayment,
    getBookingsByDoctor,
    completeBooking,
    sendMedicalRecord,
    doctorCancelBooking,
};