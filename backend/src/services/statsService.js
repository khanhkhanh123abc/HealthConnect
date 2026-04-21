import db from '../models/index';
import { Op } from 'sequelize';

const BookingModel = () => db.Booking || db.Bookings;

// Fill in missing days with count 0
const fillDays = (data, days) => {
    const map = {};
    data.forEach(r => { map[r.date] = parseInt(r.count, 10); });
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        result.push({ date: key, count: map[key] || 0 });
    }
    return result;
};

let getAdminStats = async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const BM = BookingModel();

    const [
        revenueResult,
        totalDoctors,
        totalPatients,
        newDoctorsMonth,
        newPatientsMonth,
        bookingsByStatus,
        bookingTrendRaw,
        allBookings,
        allMarkdowns,
        allSpecialties,
    ] = await Promise.all([
        BM.findOne({
            attributes: [[db.sequelize.fn('SUM', db.sequelize.col('price')), 'total']],
            where: { statusId: 'S3' },
            raw: true,
        }),
        db.User.count({ where: { roleId: 'R2' } }),
        db.User.count({ where: { roleId: 'R3' } }),
        db.User.count({ where: { roleId: 'R2', createdAt: { [Op.between]: [startOfMonth, endOfMonth] } } }),
        db.User.count({ where: { roleId: 'R3', createdAt: { [Op.between]: [startOfMonth, endOfMonth] } } }),
        BM.findAll({
            attributes: ['statusId', [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']],
            group: ['statusId'],
            raw: true,
        }),
        BM.findAll({
            attributes: [
                [db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'date'],
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
            ],
            where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
            group: [db.sequelize.fn('DATE', db.sequelize.col('createdAt'))],
            order: [[db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'ASC']],
            raw: true,
        }),
        BM.findAll({ attributes: ['doctorId'], where: { statusId: { [Op.ne]: 'S4' } }, raw: true }),
        db.Markdown.findAll({ attributes: ['doctorId', 'specialtyId'], where: { specialtyId: { [Op.ne]: null } }, raw: true }),
        db.Specialty.findAll({ attributes: ['id', 'name'], raw: true }),
    ]);

    // Build specialty distribution in JS
    const doctorToSpecialty = {};
    allMarkdowns.forEach(m => { doctorToSpecialty[m.doctorId] = m.specialtyId; });
    const specialtyIdToName = {};
    allSpecialties.forEach(s => { specialtyIdToName[s.id] = s.name; });
    const specialtyCounts = {};
    allBookings.forEach(b => {
        const specId = doctorToSpecialty[b.doctorId];
        if (specId) {
            const name = specialtyIdToName[specId] || `Khoa ${specId}`;
            specialtyCounts[name] = (specialtyCounts[name] || 0) + 1;
        }
    });
    const specialtyDist = Object.entries(specialtyCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);

    // Status map
    const statusMap = { S1: 0, S2: 0, S3: 0, S4: 0 };
    bookingsByStatus.forEach(r => { statusMap[r.statusId] = parseInt(r.count, 10); });
    const totalBookings = Object.values(statusMap).reduce((a, b) => a + b, 0);

    return {
        errCode: 0,
        data: {
            kpis: {
                totalRevenue: parseInt(revenueResult?.total || 0, 10),
                totalDoctors,
                totalPatients,
                newDoctorsMonth,
                newPatientsMonth,
                totalBookings,
                completedBookings: statusMap.S3,
                cancelledBookings: statusMap.S4,
            },
            bookingTrend: fillDays(bookingTrendRaw, 30),
            statusDist: [
                { name: 'Chờ xác nhận', value: statusMap.S1, color: '#F59E0B' },
                { name: 'Đã xác nhận',  value: statusMap.S2, color: '#3B82F6' },
                { name: 'Hoàn thành',   value: statusMap.S3, color: '#10B981' },
                { name: 'Đã hủy',       value: statusMap.S4, color: '#EF4444' },
            ],
            specialtyDist,
        },
    };
};

let getDoctorStats = async (doctorId) => {
    if (!doctorId) return { errCode: 1, errMessage: 'Missing doctorId' };

    const BM = BookingModel();
    const now = new Date();
    const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
    const endOfToday   = new Date(now); endOfToday.setHours(23, 59, 59, 999);
    const sevenDaysAgo = new Date(now); sevenDaysAgo.setDate(now.getDate() - 6); sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
        revenueResult,
        totalCompleted,
        pendingCount,
        todayBookingsRaw,
        weekTrendRaw,
        statusBreakdown,
    ] = await Promise.all([
        BM.findOne({
            attributes: [[db.sequelize.fn('SUM', db.sequelize.col('price')), 'total']],
            where: { doctorId, statusId: 'S3' },
            raw: true,
        }),
        BM.count({ where: { doctorId, statusId: 'S3' } }),
        BM.count({ where: { doctorId, statusId: 'S1' } }),
        BM.findAll({
            where: {
                doctorId,
                date: { [Op.between]: [startOfToday, endOfToday] },
                statusId: { [Op.in]: ['S1', 'S2', 'S3'] },
            },
            include: [{
                model: db.allCode,
                as: 'timeTypeDataBooking',
                attributes: ['value'],
            }],
            order: [['timeType', 'ASC']],
        }),
        BM.findAll({
            attributes: [
                [db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'date'],
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
            ],
            where: { doctorId, createdAt: { [Op.gte]: sevenDaysAgo } },
            group: [db.sequelize.fn('DATE', db.sequelize.col('createdAt'))],
            order: [[db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'ASC']],
            raw: true,
        }),
        BM.findAll({
            attributes: ['statusId', [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']],
            where: { doctorId },
            group: ['statusId'],
            raw: true,
        }),
    ]);

    // Fetch patient info for today's bookings
    const patientIds = [...new Set(todayBookingsRaw.map(b => b.patientId))];
    const patients = await db.User.findAll({
        where: { id: { [Op.in]: patientIds } },
        attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'image'],
        raw: true,
    });
    const patientMap = {};
    patients.forEach(p => { patientMap[p.id] = p; });

    const todayBookings = todayBookingsRaw.map(b => ({
        id: b.id,
        patientId: b.patientId,
        statusId: b.statusId,
        timeValue: b.timeTypeDataBooking?.value || b.timeType,
        reason: b.reason,
        paymentMethod: b.paymentMethod,
        patientName: patientMap[b.patientId]
            ? `${patientMap[b.patientId].lastName} ${patientMap[b.patientId].firstName}`
            : 'Bệnh nhân',
        patientPhone: patientMap[b.patientId]?.phoneNumber || '',
        patientImage: patientMap[b.patientId]?.image || '',
    }));

    const statusMap = { S1: 0, S2: 0, S3: 0, S4: 0 };
    statusBreakdown.forEach(r => { statusMap[r.statusId] = parseInt(r.count, 10); });

    return {
        errCode: 0,
        data: {
            kpis: {
                totalCompleted,
                totalRevenue: parseInt(revenueResult?.total || 0, 10),
                pendingCount,
                todayCount: todayBookings.length,
            },
            todayBookings,
            weekTrend: fillDays(weekTrendRaw, 7),
            statusDist: [
                { name: 'Chờ xác nhận', value: statusMap.S1, color: '#F59E0B' },
                { name: 'Đã xác nhận',  value: statusMap.S2, color: '#3B82F6' },
                { name: 'Hoàn thành',   value: statusMap.S3, color: '#10B981' },
                { name: 'Đã hủy',       value: statusMap.S4, color: '#EF4444' },
            ],
        },
    };
};

module.exports = { getAdminStats, getDoctorStats };
