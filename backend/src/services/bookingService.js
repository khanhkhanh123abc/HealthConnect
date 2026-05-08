import db from '../models/index';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import {
    sendBookingConfirmEmail,
    sendCancelEmail,
    sendMedicalRecordEmail,
    sendBankTransferPendingEmail,
    sendBankTransferConfirmedEmail,
    sendPrescriptionEmail,
    sendWithRetry,
} from './emailService';
import { createRefund } from './paypalService';
import logger from '../utils/logger.js';

const DAY_LABELS = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

const formatDate = (date) => {
    const d = new Date(date);
    return `${DAY_LABELS[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

const getBookingModel = () => db.Booking || db.Bookings;

// Resolve doctor's authoritative price (USD) from Doctor_Info → allCode (PRICE).
// Returns 0 when missing — booking is still created, payment will be enforced
// at the PayPal flow.
const resolvePriceUsd = async (doctorId) => {
    try {
        const info = await db.Doctor_Info.findOne({
            where: { doctorId },
            attributes: ['priceId'],
            raw: true
        });
        if (!info?.priceId) return 0;

        const code = await db.allCode.findOne({
            where: { keyMap: info.priceId, type: 'PRICE' },
            attributes: ['value'],
            raw: true
        });
        if (!code?.value) return 0;
        const cleaned = String(code.value).replace(/[^\d.]/g, '');
        const parsed = parseFloat(cleaned);
        return Number.isFinite(parsed) ? parsed : 0;
    } catch (e) {
        logger.error({ err: e, doctorId }, '[resolvePriceUsd] error');
        return 0;
    }
};

async function createBooking(data) {
    const t = await db.sequelize.transaction();
    try {
        if (!data.doctorId || !data.date || !data.timeType || !data.patientId) {
            await t.rollback();
            return { errCode: 1, errMessage: 'Thiếu thông tin đặt lịch!' };
        }

        const dateStart = new Date(+data.date);
        dateStart.setHours(0, 0, 0, 0);
        const dateEnd = new Date(+data.date);
        dateEnd.setHours(23, 59, 59, 999);

        const schedule = await db.Schedule.findOne({
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
            return { errCode: 2, errMessage: 'Khung giờ này không tồn tại!' };
        }
        if (schedule.currentNumber >= schedule.maxNumber) {
            await t.rollback();
            return { errCode: 3, errMessage: 'Khung giờ này đã hết chỗ!' };
        }

        const BookingModel = getBookingModel();

        // Block duplicate active booking for the same slot.
        const activeBooking = await BookingModel.findOne({
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
            return { errCode: 4, errMessage: 'Bạn đã đặt lịch khám cho khung giờ này rồi!' };
        }

        // Reuse a previously cancelled booking row instead of inserting a new one.
        const cancelledBooking = await BookingModel.findOne({
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
        let savedBookingId;

        if (cancelledBooking) {
            cancelledBooking.statusId = 'S1';
            cancelledBooking.reason = data.reason || '';
            cancelledBooking.token = confirmToken;
            cancelledBooking.paymentMethod = data.paymentMethod || 'CASH';
            await cancelledBooking.save({ transaction: t });
            savedBookingId = cancelledBooking.id;
        } else {
            const newBooking = await BookingModel.create({
                statusId: 'S1',
                doctorId: data.doctorId,
                patientId: data.patientId,
                date: new Date(+data.date),
                timeType: data.timeType,
                reason: data.reason || '',
                token: confirmToken,
                paymentMethod: data.paymentMethod || 'CASH'
            }, { transaction: t });
            savedBookingId = newBooking.id;
        }

        schedule.currentNumber += 1;
        await schedule.save({ transaction: t });
        await t.commit();

        // Persist resolved price after commit (best-effort).
        const priceAmountUsd = await resolvePriceUsd(data.doctorId);
        try {
            await BookingModel.update(
                { price: Math.round(priceAmountUsd) },
                { where: { id: savedBookingId } }
            );
        } catch (e) {
            logger.error({ err: e, bookingId: savedBookingId }, '[createBooking] price update failed');
        }

        // Fire-and-forget email notification (must not block the response).
        // eslint-disable-next-line no-floating-promise/no-floating-promise
        (async () => {
            try {
                const [patient, doctor, timeTypeData, markdown] = await Promise.all([
                    db.User.findOne({ where: { id: data.patientId }, attributes: ['firstName', 'lastName', 'email'], raw: true }),
                    db.User.findOne({ where: { id: data.doctorId },  attributes: ['firstName', 'lastName'], raw: true }),
                    db.allCode.findOne({ where: { keyMap: data.timeType, type: 'TIME' }, attributes: ['value'], raw: true }),
                    db.Markdown.findOne({ where: { doctorId: data.doctorId }, attributes: ['clinicId'], raw: true })
                ]);

                let clinicName = '', clinicAddress = '';
                if (markdown?.clinicId) {
                    const clinic = await db.Clinic.findOne({
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
                    await sendWithRetry('bankTransferPending', { bookingId: savedBookingId, recipient: patient?.email }, () =>
                        sendBankTransferPendingEmail({
                            patientEmail: patient?.email,
                            patientName, doctorName, timeValue, dateStr,
                            clinicName, clinicAddress,
                            reason: data.reason || '',
                            bookingToken: confirmToken,
                            amountUsd: priceAmountUsd,
                        })
                    );
                } else {
                    const confirmLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/confirm-booking?token=${confirmToken}`;
                    await sendWithRetry('bookingConfirm', { bookingId: savedBookingId, recipient: patient?.email }, () =>
                        sendBookingConfirmEmail({
                            patientEmail: patient?.email,
                            patientName, doctorName, timeValue, dateStr,
                            clinicName, clinicAddress,
                            reason: data.reason || '',
                            confirmLink,
                        })
                    );
                }
            } catch (emailErr) {
                logger.error({ err: emailErr, bookingId: savedBookingId }, 'Email send failed (non-blocking)');
            }
        })();

        return {
            errCode: 0,
            errMessage: 'Đặt lịch thành công!',
            remainingSlots: schedule.maxNumber - schedule.currentNumber,
            token: confirmToken,
            bookingId: savedBookingId,
            amountUsd: priceAmountUsd,
        };
    } catch (e) {
        try { await t.rollback(); } catch (_e) { /* already rolled back */ }
        if (e.name === 'SequelizeUniqueConstraintError') {
            return { errCode: 4, errMessage: 'Bạn đã đặt lịch khám cho khung giờ này rồi!' };
        }
        logger.error({ err: e }, 'createBooking error');
        throw e;
    }
}

async function confirmBookingByToken(token) {
    if (!token) return { errCode: 1, errMessage: 'Token không hợp lệ!' };

    const BookingModel = getBookingModel();
    const booking = await BookingModel.findOne({ where: { token }, raw: false });
    if (!booking) return { errCode: 2, errMessage: 'Lịch hẹn không tồn tại hoặc link đã hết hiệu lực!' };

    if (booking.statusId === 'S2') {
        return { errCode: 0, errMessage: 'Lịch hẹn đã được xác nhận trước đó!', alreadyConfirmed: true };
    }
    if (booking.statusId === 'S4') {
        return { errCode: 3, errMessage: 'Lịch hẹn này đã bị hủy!' };
    }

    booking.statusId = 'S2';
    await booking.save();
    return { errCode: 0, errMessage: 'Xác nhận lịch khám thành công!' };
}

async function getBookingsByPatient(patientId) {
    if (!patientId) return { errCode: 1, errMessage: 'Missing required parameter' };

    const BookingModel = getBookingModel();
    const bookings = await BookingModel.findAll({
        where: { patientId },
        order: [['date', 'DESC']],
        raw: true
    });

    const result = await Promise.all(bookings.map(async (booking) => {
        const [doctor, timeTypeData, markdown] = await Promise.all([
            db.User.findOne({ where: { id: booking.doctorId }, attributes: ['firstName', 'lastName', 'image'], raw: true }),
            db.allCode.findOne({ where: { keyMap: booking.timeType, type: 'TIME' }, attributes: ['value'], raw: true }),
            db.Markdown.findOne({ where: { doctorId: booking.doctorId }, attributes: ['clinicId'], raw: true }).catch(() => null)
        ]);

        let clinicName = '', clinicAddress = '';
        if (markdown?.clinicId) {
            const clinic = await db.Clinic.findOne({
                where: { id: markdown.clinicId },
                attributes: ['name', 'address'],
                raw: true
            });
            clinicName = clinic?.name || '';
            clinicAddress = clinic?.address || '';
        }

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

    return { errCode: 0, data: result };
}

async function cancelBooking(bookingId, patientId) {
    if (!bookingId || !patientId) return { errCode: 1, errMessage: 'Missing required parameters' };

    const t = await db.sequelize.transaction();
    try {
        const BookingModel = getBookingModel();
        const booking = await BookingModel.findOne({
            where: { id: bookingId, patientId },
            transaction: t,
            raw: false
        });

        if (!booking) {
            await t.rollback();
            return { errCode: 2, errMessage: 'Không tìm thấy lịch hẹn!' };
        }
        if (!['S1', 'S2'].includes(booking.statusId)) {
            await t.rollback();
            return { errCode: 3, errMessage: 'Không thể hủy lịch ở trạng thái này!' };
        }

        const isPaid = booking.statusId === 'S2' && booking.paymentMethod === 'BANK';
        let refundResult = null;

        if (isPaid) {
            refundResult = await createRefund(booking);
            if (!refundResult.success) {
                await t.rollback();
                return { errCode: 4, errMessage: 'Hoàn tiền thất bại: ' + refundResult.message };
            }
            booking.refundAmount = refundResult.refundAmount || booking.price;
            booking.refundStatus = refundResult.isPending ? 'PENDING' : 'REFUNDED';
        }

        booking.statusId = 'S4';
        await booking.save({ transaction: t });

        // Free up the schedule slot.
        const dateStart = new Date(booking.date);
        dateStart.setHours(0, 0, 0, 0);
        const dateEnd = new Date(booking.date);
        dateEnd.setHours(23, 59, 59, 999);

        const schedule = await db.Schedule.findOne({
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

        // Fire-and-forget cancellation email.
        (async () => {
            try {
                const [patient, doctor, timeTypeData] = await Promise.all([
                    db.User.findOne({ where: { id: patientId }, attributes: ['firstName', 'lastName', 'email'], raw: true }),
                    db.User.findOne({ where: { id: booking.doctorId }, attributes: ['firstName', 'lastName'], raw: true }),
                    db.allCode.findOne({ where: { keyMap: booking.timeType, type: 'TIME' }, attributes: ['value'], raw: true })
                ]);

                const refundNote = isPaid
                    ? `\nSố tiền ${(booking.refundAmount || 0).toLocaleString('vi-VN')}đ đang được xử lý hoàn về tài khoản của bạn.`
                    : '';

                await sendWithRetry('patientCancel', { bookingId: booking.id, recipient: patient?.email }, () =>
                    sendCancelEmail({
                        patientEmail: patient?.email,
                        patientName: `${patient?.lastName || ''} ${patient?.firstName || ''}`.trim(),
                        doctorName: `BS. ${doctor?.lastName || ''} ${doctor?.firstName || ''}`.trim(),
                        timeValue: timeTypeData?.value || booking.timeType,
                        dateStr: formatDate(booking.date),
                        refundNote
                    })
                );
            } catch (e) {
                logger.error({ err: e, bookingId: booking.id }, 'Send cancel email error');
            }
        })();

        let message = 'Hủy lịch thành công!';
        if (isPaid) message += ' Yêu cầu hoàn tiền đã được gửi.';

        return {
            errCode: 0,
            errMessage: message,
            refundStatus: booking.refundStatus,
            refundAmount: booking.refundAmount
        };
    } catch (e) {
        try { await t.rollback(); } catch (_e) { /* already rolled back */ }
        logger.error({ err: e }, 'cancelBooking error');
        throw e;
    }
}

async function doctorCancelBooking(bookingId, doctorId, cancelReason) {
    if (!bookingId || !doctorId) return { errCode: 1, errMessage: 'Missing parameters' };

    const t = await db.sequelize.transaction();
    try {
        const BookingModel = getBookingModel();
        const booking = await BookingModel.findOne({
            where: { id: bookingId, doctorId },
            transaction: t,
            raw: false
        });

        if (!booking) {
            await t.rollback();
            return { errCode: 2, errMessage: 'Không tìm thấy lịch hẹn!' };
        }
        if (!['S1', 'S2'].includes(booking.statusId)) {
            await t.rollback();
            return { errCode: 3, errMessage: 'Không thể hủy lịch ở trạng thái này!' };
        }

        const isPaid = booking.statusId === 'S2' && booking.paymentMethod === 'BANK';
        let refundResult = null;

        if (isPaid) {
            refundResult = await createRefund(booking);
            if (!refundResult.success) {
                await t.rollback();
                return { errCode: 4, errMessage: 'Hoàn tiền thất bại: ' + refundResult.message };
            }
            booking.refundAmount = refundResult.refundAmount || booking.price;
            booking.refundStatus = refundResult.isPending ? 'PENDING' : 'REFUNDED';
        }

        booking.statusId = 'S4';
        await booking.save({ transaction: t });

        const dateStart = new Date(booking.date);
        dateStart.setHours(0, 0, 0, 0);
        const dateEnd = new Date(booking.date);
        dateEnd.setHours(23, 59, 59, 999);

        const schedule = await db.Schedule.findOne({
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

        // Fire-and-forget cancellation email.
        (async () => {
            try {
                const [patient, doctor, timeTypeData] = await Promise.all([
                    db.User.findOne({ where: { id: booking.patientId }, attributes: ['firstName', 'lastName', 'email'], raw: true }),
                    db.User.findOne({ where: { id: doctorId }, attributes: ['firstName', 'lastName'], raw: true }),
                    db.allCode.findOne({ where: { keyMap: booking.timeType, type: 'TIME' }, attributes: ['value'], raw: true })
                ]);

                const refundNote = isPaid
                    ? `\nSố tiền ${(booking.refundAmount || 0).toLocaleString('vi-VN')}đ đang được xử lý hoàn về tài khoản của bạn.`
                    : '';

                await sendWithRetry('doctorCancel', { bookingId: booking.id, recipient: patient?.email }, () =>
                    sendCancelEmail({
                        patientEmail: patient?.email,
                        patientName: `${patient?.lastName || ''} ${patient?.firstName || ''}`.trim(),
                        doctorName: `BS. ${doctor?.lastName || ''} ${doctor?.firstName || ''}`.trim(),
                        timeValue: timeTypeData?.value || booking.timeType,
                        dateStr: formatDate(booking.date),
                        refundNote,
                        cancelReason: cancelReason || 'Bác sĩ hủy lịch'
                    })
                );
            } catch (e) {
                logger.error({ err: e, bookingId: booking.id }, 'Doctor cancel email error');
            }
        })();

        let message = 'Bác sĩ đã hủy lịch thành công!';
        if (isPaid) message += ' Yêu cầu hoàn tiền đã được gửi.';

        return {
            errCode: 0,
            errMessage: message,
            refundStatus: booking.refundStatus,
            refundAmount: booking.refundAmount
        };
    } catch (e) {
        try { await t.rollback(); } catch (_e) { /* already rolled back */ }
        logger.error({ err: e }, 'doctorCancelBooking error');
        throw e;
    }
}

async function getScheduleWithSlots(doctorId, date) {
    if (!doctorId || !date) return { errCode: 1, errMessage: 'Missing parameters' };

    const dateStart = new Date(+date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(+date);
    dateEnd.setHours(23, 59, 59, 999);

    const schedules = await db.Schedule.findAll({
        where: { doctorId, date: { [Op.between]: [dateStart, dateEnd] } },
        include: [{ model: db.allCode, as: 'timeTypeData', attributes: ['value', 'keyMap'] }],
        raw: false,
        nest: true
    });

    const result = schedules.map(s => ({
        timeType: s.timeType,
        timeValue: s.timeTypeData?.value || s.timeType,
        maxNumber: s.maxNumber,
        currentNumber: s.currentNumber,
        remainingSlots: s.maxNumber - s.currentNumber,
        isFull: s.currentNumber >= s.maxNumber
    }));

    return { errCode: 0, data: result };
}

async function getBookingsByDoctor(doctorId, weekStart) {
    if (!doctorId) return { errCode: 1, errMessage: 'Missing doctorId' };

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

    const BookingModel = getBookingModel();
    const bookings = await BookingModel.findAll({
        where: {
            doctorId,
            date: { [Op.between]: [startDate, endDate] },
            statusId: { [Op.in]: ['S1', 'S2', 'S3'] }
        },
        order: [['date', 'ASC'], ['timeType', 'ASC']],
        raw: true
    });

    const result = await Promise.all(bookings.map(async (booking) => {
        const [patient, timeTypeData] = await Promise.all([
            db.User.findOne({
                where: { id: booking.patientId },
                attributes: ['firstName', 'lastName', 'email', 'phoneNumber', 'gender', 'address', 'image'],
                raw: true
            }),
            db.allCode.findOne({ where: { keyMap: booking.timeType, type: 'TIME' }, attributes: ['value'], raw: true })
        ]);
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

    return { errCode: 0, data: result };
}

async function completeBooking(bookingId, doctorId) {
    if (!bookingId || !doctorId) return { errCode: 1, errMessage: 'Missing parameters' };

    const BookingModel = getBookingModel();
    const booking = await BookingModel.findOne({ where: { id: bookingId, doctorId }, raw: false });
    if (!booking) return { errCode: 2, errMessage: 'Không tìm thấy lịch hẹn!' };
    if (booking.statusId !== 'S2') return { errCode: 3, errMessage: 'Chỉ có thể hoàn thành lịch đã xác nhận!' };

    booking.statusId = 'S3';
    await booking.save();
    return { errCode: 0, errMessage: 'Đã đánh dấu hoàn thành!' };
}

async function sendMedicalRecord(bookingId, doctorId, content) {
    if (!bookingId || !doctorId || !content) return { errCode: 1, errMessage: 'Missing parameters' };

    const BookingModel = getBookingModel();
    const booking = await BookingModel.findOne({ where: { id: bookingId, doctorId }, raw: true });
    if (!booking) return { errCode: 2, errMessage: 'Không tìm thấy lịch hẹn!' };

    const [patient, doctor] = await Promise.all([
        db.User.findOne({ where: { id: booking.patientId }, attributes: ['firstName', 'lastName', 'email'], raw: true }),
        db.User.findOne({ where: { id: doctorId }, attributes: ['firstName', 'lastName'], raw: true })
    ]);
    if (!patient?.email) return { errCode: 3, errMessage: 'Không tìm thấy email bệnh nhân!' };

    await sendMedicalRecordEmail({
        patientEmail: patient.email,
        patientName: `${patient.lastName || ''} ${patient.firstName || ''}`.trim(),
        doctorName: `BS. ${doctor?.lastName || ''} ${doctor?.firstName || ''}`.trim(),
        content,
        bookingId
    });
    return { errCode: 0, errMessage: 'Đã gửi hồ sơ qua email!' };
}

async function confirmPayment(bookingId) {
    if (!bookingId) return { errCode: 1, errMessage: 'Missing bookingId!' };

    const BookingModel = getBookingModel();
    const booking = await BookingModel.findOne({ where: { id: bookingId }, raw: false });
    if (!booking) return { errCode: 2, errMessage: 'Không tìm thấy lịch hẹn!' };
    if (booking.paymentMethod !== 'BANK') return { errCode: 3, errMessage: 'Lịch này không phải thanh toán chuyển khoản!' };
    if (booking.statusId === 'S2') return { errCode: 0, errMessage: 'Lịch đã được xác nhận trước đó!', alreadyConfirmed: true };
    if (booking.statusId === 'S4') return { errCode: 4, errMessage: 'Lịch đã bị hủy, không thể xác nhận!' };

    booking.statusId = 'S2';
    await booking.save();

    (async () => {
        try {
            const [patient, doctor, timeTypeData] = await Promise.all([
                db.User.findOne({ where: { id: booking.patientId }, attributes: ['firstName', 'lastName', 'email'], raw: true }),
                db.User.findOne({ where: { id: booking.doctorId }, attributes: ['firstName', 'lastName'], raw: true }),
                db.allCode.findOne({ where: { keyMap: booking.timeType, type: 'TIME' }, attributes: ['value'], raw: true })
            ]);
            await sendWithRetry('bankTransferConfirmed', { bookingId: booking.id, recipient: patient?.email }, () =>
                sendBankTransferConfirmedEmail({
                    patientEmail: patient?.email,
                    patientName: `${patient?.lastName || ''} ${patient?.firstName || ''}`.trim(),
                    doctorName: `BS. ${doctor?.lastName || ''} ${doctor?.firstName || ''}`.trim(),
                    timeValue: timeTypeData?.value || booking.timeType,
                    dateStr: formatDate(booking.date),
                })
            );
        } catch (e) {
            logger.error({ err: e, bookingId: booking.id }, 'Email confirm payment failed');
        }
    })();

    return { errCode: 0, errMessage: 'Xác nhận thanh toán thành công! Lịch đã được chốt.' };
}

async function getPendingBankBookings() {
    const BookingModel = getBookingModel();
    const bookings = await BookingModel.findAll({
        where: { paymentMethod: 'BANK', statusId: 'S1' },
        order: [['createdAt', 'ASC']],
        raw: true
    });

    const result = await Promise.all(bookings.map(async (booking) => {
        const [patient, doctor, timeTypeData] = await Promise.all([
            db.User.findOne({ where: { id: booking.patientId }, attributes: ['firstName', 'lastName', 'email', 'phoneNumber'], raw: true }),
            db.User.findOne({ where: { id: booking.doctorId }, attributes: ['firstName', 'lastName'], raw: true }),
            db.allCode.findOne({ where: { keyMap: booking.timeType, type: 'TIME' }, attributes: ['value'], raw: true })
        ]);
        return {
            ...booking,
            timeValue: timeTypeData?.value || booking.timeType,
            patientName: patient ? `${patient.lastName || ''} ${patient.firstName || ''}`.trim() : 'Bệnh nhân',
            patientEmail: patient?.email || '',
            patientPhone: patient?.phoneNumber || '',
            doctorName: doctor ? `BS. ${doctor.lastName || ''} ${doctor.firstName || ''}`.trim() : 'Bác sĩ',
        };
    }));

    return { errCode: 0, data: result };
}

async function sendPrescription(bookingId, doctorId, { diagnosis, medications, instructions }) {
    if (!bookingId || !doctorId || !diagnosis) return { errCode: 1, errMessage: 'Missing parameters' };

    const BookingModel = getBookingModel();
    const booking = await BookingModel.findOne({ where: { id: bookingId, doctorId }, raw: true });
    if (!booking) return { errCode: 2, errMessage: 'Không tìm thấy lịch hẹn!' };

    const [patient, doctor] = await Promise.all([
        db.User.findOne({ where: { id: booking.patientId }, attributes: ['firstName', 'lastName', 'email'], raw: true }),
        db.User.findOne({ where: { id: doctorId }, attributes: ['firstName', 'lastName'], raw: true }),
    ]);
    if (!patient?.email) return { errCode: 3, errMessage: 'Không tìm thấy email bệnh nhân!' };

    const patientName = `${patient.lastName || ''} ${patient.firstName || ''}`.trim();
    const doctorName = `BS. ${doctor?.lastName || ''} ${doctor?.firstName || ''}`.trim();

    const { generatePrescriptionPdf } = require('./prescriptionService');
    const pdfBuffer = await generatePrescriptionPdf({
        doctorName,
        patientName,
        diagnosis,
        medications,
        instructions,
        date: new Date().toLocaleDateString('vi-VN'),
    });

    await sendPrescriptionEmail({ patientEmail: patient.email, patientName, doctorName, pdfBuffer });

    return { errCode: 0, errMessage: 'Đã gửi đơn thuốc qua email!' };
}

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
    sendPrescription,
};
