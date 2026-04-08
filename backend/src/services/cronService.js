import cron from 'node-cron';
import db from '../models/index';
import { Op } from 'sequelize';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_APP,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

const DAY_LABELS = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

const formatDate = (date) => {
    const d = new Date(date);
    return `${DAY_LABELS[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

// ✅ Email thông báo hủy do hết thời gian xác nhận
const sendExpiredEmail = async ({ patientEmail, patientName, doctorName, timeValue, dateStr }) => {
    try {
        const html = `
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"></head>
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f9;padding:40px 20px;margin:0">
  <table width="600" cellpadding="0" cellspacing="0"
    style="background:#fff;border-radius:16px;overflow:hidden;margin:0 auto;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

    <!-- Header -->
    <tr>
      <td style="background:#f59e0b;padding:30px 40px;text-align:center">
        <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700">
          ⏰ Lịch khám đã hết hạn xác nhận
        </h1>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:30px 40px">
        <p style="color:#374151;font-size:15px;margin:0 0 16px">
          Xin chào <strong>${patientName}</strong>,
        </p>
        <p style="color:#6b7280;font-size:14px;margin:0 0 20px;line-height:1.7">
          Lịch khám của bạn đã bị <strong style="color:#ef4444">tự động hủy</strong>
          vì bạn không xác nhận trong vòng <strong>10 phút</strong>.
        </p>

        <!-- Booking info -->
        <table width="100%" cellpadding="0" cellspacing="0"
          style="background:#fef3c7;border:1px solid #fde68a;border-radius:10px;margin-bottom:20px">
          <tr>
            <td style="padding:16px 20px">
              <p style="margin:0 0 8px;font-size:13px;color:#92400e;font-weight:600;text-transform:uppercase">
                Thông tin lịch đã hủy
              </p>
              <p style="margin:4px 0;font-size:14px;color:#78350f">
                🩺 <strong>Bác sĩ:</strong> ${doctorName}
              </p>
              <p style="margin:4px 0;font-size:14px;color:#78350f">
                📅 <strong>Ngày:</strong> ${dateStr}
              </p>
              <p style="margin:4px 0;font-size:14px;color:#78350f">
                ⏰ <strong>Giờ:</strong> ${timeValue}
              </p>
            </td>
          </tr>
        </table>

        <p style="color:#6b7280;font-size:14px;margin:0 0 20px;line-height:1.7">
          Nếu bạn vẫn muốn khám, hãy đặt lịch mới trên hệ thống HealthConnect
          và <strong>nhớ xác nhận qua email trong 10 phút</strong> nhé!
        </p>

        <!-- CTA -->
        <div style="text-align:center;margin:24px 0">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/booking"
            style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;
              padding:12px 32px;border-radius:10px;font-size:15px;font-weight:700">
            Đặt lịch mới →
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 40px;text-align:center">
        <p style="margin:0;color:#9ca3af;font-size:12px">
          Email tự động từ HealthConnect. Vui lòng không trả lời email này.
        </p>
      </td>
    </tr>

  </table>
</body>
</html>`;

        await transporter.sendMail({
            from: `"HealthConnect" <${process.env.EMAIL_APP}>`,
            to: patientEmail,
            subject: `[HealthConnect] Lịch khám đã hủy do hết thời gian xác nhận`,
            html
        });
    } catch (e) {
        console.error('[CRON] Lỗi gửi email hủy hạn:', e.message);
    }
};

// ✅ Cron chạy mỗi phút
const startAutoCancelCron = () => {
    cron.schedule('* * * * *', async () => {
        try {
            const BookingModel = db.Booking || db.Bookings;
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

            const expiredBookings = await BookingModel.findAll({
                where: {
                    statusId: 'S1',
                    createdAt: { [Op.lt]: tenMinutesAgo }
                },
                raw: false
            });

            if (expiredBookings.length === 0) return;

            console.log(`[CRON] ${expiredBookings.length} booking hết hạn, đang xử lý...`);

            for (const booking of expiredBookings) {
                const t = await db.sequelize.transaction();
                try {
                    // Hủy booking
                    booking.statusId = 'S4';
                    await booking.save({ transaction: t });

                    // Trả lại slot
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
                    console.log(`[CRON] Đã hủy booking id=${booking.id}`);

                    // ✅ Gửi email thông báo (sau commit, non-blocking)
                    (async () => {
                        try {
                            // Lấy thông tin patient + doctor + timeType
                            const [patient, doctor, timeTypeData] = await Promise.all([
                                db.User.findOne({
                                    where: { id: booking.patientId },
                                    attributes: ['firstName', 'lastName', 'email'],
                                    raw: true
                                }),
                                db.User.findOne({
                                    where: { id: booking.doctorId },
                                    attributes: ['firstName', 'lastName'],
                                    raw: true
                                }),
                                db.allCode.findOne({
                                    where: { keyMap: booking.timeType, type: 'TIME' },
                                    attributes: ['value'],
                                    raw: true
                                })
                            ]);

                            if (patient?.email) {
                                await sendExpiredEmail({
                                    patientEmail: patient.email,
                                    patientName: `${patient.lastName || ''} ${patient.firstName || ''}`.trim(),
                                    doctorName: doctor
                                        ? `BS. ${doctor.lastName || ''} ${doctor.firstName || ''}`.trim()
                                        : 'Bác sĩ',
                                    timeValue: timeTypeData?.value || booking.timeType,
                                    dateStr: formatDate(booking.date)
                                });
                                console.log(`[CRON] Đã gửi email hủy hạn đến ${patient.email}`);
                            }
                        } catch (emailErr) {
                            console.error('[CRON] Lỗi gửi email:', emailErr.message);
                        }
                    })();

                } catch (err) {
                    await t.rollback();
                    console.error(`[CRON] Lỗi hủy booking id=${booking.id}:`, err.message);
                }
            }
        } catch (err) {
            console.error('[CRON] Lỗi cron:', err.message);
        }
    });

    console.log('[CRON] Auto-cancel cron đã khởi động (mỗi phút)');
};

module.exports = { startAutoCancelCron };