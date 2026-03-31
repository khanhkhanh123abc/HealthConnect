import db from '../models/index';
import { Op } from 'sequelize';

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

            // LOCK row Schedule → request thứ 2 phải chờ request thứ 1 commit xong
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
                resolve({
                    errCode: 3,
                    errMessage: `Khung giờ này đã hết chỗ! (${schedule.maxNumber}/${schedule.maxNumber} chỗ đã đặt)`
                });
                return;
            }

            const BookingModel = db.Booking || db.Bookings;
            let existingBooking = await BookingModel.findOne({
                where: {
                    patientId: data.patientId,
                    doctorId: data.doctorId,
                    date: { [Op.between]: [dateStart, dateEnd] },
                    timeType: data.timeType,
                    statusId: { [Op.in]: ['S1', 'S2'] }
                },
                transaction: t
            });

            if (existingBooking) {
                await t.rollback();
                resolve({ errCode: 4, errMessage: 'Bạn đã đặt lịch khám cho khung giờ này rồi!' });
                return;
            }

            await BookingModel.create({
                statusId: 'S1',
                doctorId: data.doctorId,
                patientId: data.patientId,
                date: new Date(+data.date),
                timeType: data.timeType,
                reason: data.reason || ''
            }, { transaction: t });

            schedule.currentNumber += 1;
            await schedule.save({ transaction: t });

            await t.commit();
            resolve({
                errCode: 0,
                errMessage: 'Đặt lịch thành công!',
                remainingSlots: schedule.maxNumber - schedule.currentNumber
            });

        } catch (e) {
            await t.rollback();
            // UNIQUE constraint chặn race condition cuối cùng
            if (e.name === 'SequelizeUniqueConstraintError') {
                resolve({ errCode: 4, errMessage: 'Bạn đã đặt lịch khám cho khung giờ này rồi!' });
            } else {
                console.error('createBooking error:', e);
                reject(e);
            }
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
                where: {
                    doctorId,
                    date: { [Op.between]: [dateStart, dateEnd] }
                },
                include: [{
                    model: db.allCode,
                    as: 'timeTypeData',
                    attributes: ['value', 'keyMap']
                }],
                raw: false,
                nest: true
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

let getBookingsByPatient = (patientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!patientId) {
                resolve({ errCode: 1, errMessage: 'Missing required parameter' });
                return;
            }
            const BookingModel = db.Booking || db.Bookings;
            let data = await BookingModel.findAll({
                where: { patientId },
                order: [['createdAt', 'DESC']],
                raw: true,
                nest: true
            });
            resolve({ errCode: 0, data: data || [] });
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = { createBooking, getScheduleWithSlots, getBookingsByPatient }