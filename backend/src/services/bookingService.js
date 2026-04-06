import db from '../models/index';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { sendBookingConfirmEmail, sendCancelEmail } from './emailService';

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

            // ✅ Kiểm tra có booking đã hủy (S4) không → reuse thay vì insert mới
            // (tránh lỗi UNIQUE constraint nếu vẫn còn)
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

            if (cancelledBooking) {
                // Update booking đã hủy → S1 mới
                cancelledBooking.statusId = 'S1';
                cancelledBooking.reason = data.reason || '';
                cancelledBooking.token = confirmToken;
                await cancelledBooking.save({ transaction: t });
            } else {
                // Tạo booking mới
                await BookingModel.create({
                    statusId: 'S1',
                    doctorId: data.doctorId,
                    patientId: data.patientId,
                    date: new Date(+data.date),
                    timeType: data.timeType,
                    reason: data.reason || '',
                    token: confirmToken
                }, { transaction: t });
            }

            schedule.currentNumber += 1;
            await schedule.save({ transaction: t });
            await t.commit();

            // ===== GỬI EMAIL SAU KHI COMMIT =====
            // Không await - không block response
            (async () => {
                try {
                    // Lấy thông tin để gửi email
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

                    // Lấy địa chỉ phòng khám
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

                    const confirmLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/confirm-booking?token=${confirmToken}`;
                    const doctorName = doctor
                        ? `BS. ${doctor.lastName || ''} ${doctor.firstName || ''}`.trim()
                        : 'Bác sĩ';
                    const patientName = patient
                        ? `${patient.lastName || ''} ${patient.firstName || ''}`.trim()
                        : 'Bạn';

                    await sendBookingConfirmEmail({
                        patientEmail: patient?.email,
                        patientName,
                        doctorName,
                        timeValue: timeTypeData?.value || data.timeType,
                        dateStr: formatDate(data.date),
                        clinicName,
                        clinicAddress,
                        reason: data.reason || '',
                        confirmLink
                    });
                } catch (emailErr) {
                    console.error('Email send failed (non-blocking):', emailErr.message);
                }
            })();

            resolve({
                errCode: 0,
                errMessage: 'Đặt lịch thành công! Email xác nhận đã được gửi.',
                remainingSlots: schedule.maxNumber - schedule.currentNumber
            });

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
}

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

            booking.statusId = 'S2'; // Confirmed
            await booking.save();

            resolve({ errCode: 0, errMessage: 'Xác nhận lịch khám thành công!' });
        } catch (e) {
            console.error('confirmBookingByToken error:', e);
            reject(e);
        }
    });
}

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
                } catch (_e) {}

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
}

let cancelBooking = (bookingId, patientId) => {
    return new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            if (!bookingId || !patientId) {
                await t.rollback();
                resolve({ errCode: 1, errMessage: 'Missing required parameters' });
                return;
            }

            const BookingModel = db.Booking || db.Bookings;
            let booking = await BookingModel.findOne({
                where: { id: bookingId, patientId },
                transaction: t, raw: false
            });

            if (!booking) {
                await t.rollback();
                resolve({ errCode: 2, errMessage: 'Không tìm thấy lịch hẹn!' });
                return;
            }
            if (booking.statusId !== 'S1') {
                await t.rollback();
                resolve({ errCode: 3, errMessage: 'Chỉ có thể hủy lịch đang chờ xác nhận!' });
                return;
            }

            booking.statusId = 'S4';
            await booking.save({ transaction: t });

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
                transaction: t, raw: false
            });
            if (schedule && schedule.currentNumber > 0) {
                schedule.currentNumber -= 1;
                await schedule.save({ transaction: t });
            }
            await t.commit();

            // Gửi email thông báo hủy (non-blocking)
            (async () => {
                try {
                    let patient = await db.User.findOne({
                        where: { id: patientId },
                        attributes: ['firstName', 'lastName', 'email'], raw: true
                    });
                    let doctor = await db.User.findOne({
                        where: { id: booking.doctorId },
                        attributes: ['firstName', 'lastName'], raw: true
                    });
                    let timeTypeData = await db.allCode.findOne({
                        where: { keyMap: booking.timeType, type: 'TIME' },
                        attributes: ['value'], raw: true
                    });
                    await sendCancelEmail({
                        patientEmail: patient?.email,
                        patientName: patient
                            ? `${patient.lastName || ''} ${patient.firstName || ''}`.trim()
                            : 'Bạn',
                        doctorName: doctor
                            ? `BS. ${doctor.lastName || ''} ${doctor.firstName || ''}`.trim()
                            : 'Bác sĩ',
                        timeValue: timeTypeData?.value || booking.timeType,
                        dateStr: formatDate(booking.date)
                    });
                } catch (_e) {}
            })();

            resolve({ errCode: 0, errMessage: 'Hủy lịch thành công!' });
        } catch (e) {
            await t.rollback();
            reject(e);
        }
    });
}

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
}

module.exports = {
    createBooking,
    confirmBookingByToken,
    getBookingsByPatient,
    cancelBooking,
    getScheduleWithSlots
}