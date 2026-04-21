import nodemailer from 'nodemailer';

// ===== CẤU HÌNH NODEMAILER =====
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_APP,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// ===== HTML EMAIL TEMPLATE =====
let buildBookingEmailHTML = (data) => {
  const {
    patientName,
    doctorName,
    timeValue,
    dateStr,
    clinicName,
    clinicAddress,
    reason,
    confirmLink
  } = data;

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác nhận lịch khám</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">
                HealthConnect
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">
                Hệ thống đặt lịch khám trực tuyến
              </p>
            </td>
          </tr>

          <!-- GREETING -->
          <tr>
            <td style="padding:36px 40px 0;">
              <h2 style="margin:0 0 8px;color:#1e1b4b;font-size:20px;font-weight:600;">
                Xin chào, ${patientName}!
              </h2>
              <p style="margin:0;color:#6b7280;font-size:15px;line-height:1.6;">
                Bạn vừa đặt lịch khám thành công. Vui lòng xem thông tin bên dưới và xác nhận lịch hẹn.
              </p>
            </td>
          </tr>

          <!-- BOOKING INFO CARD -->
          <tr>
            <td style="padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#f8f7ff;border:1px solid #e0e7ff;border-radius:12px;overflow:hidden;">

                <tr>
                  <td style="background:#4f46e5;padding:14px 24px;">
                    <p style="margin:0;color:#ffffff;font-size:13px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;">
                      Thông tin lịch khám
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">

                      <!-- Doctor -->
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                          <table width="100%"><tr>
                            <td style="color:#6b7280;font-size:14px;width:140px;">Bác sĩ khám</td>
                            <td style="color:#111827;font-size:14px;font-weight:600;">${doctorName}</td>
                          </tr></table>
                        </td>
                      </tr>

                      <!-- Date -->
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                          <table width="100%"><tr>
                            <td style="color:#6b7280;font-size:14px;width:140px;">Ngày khám</td>
                            <td style="color:#111827;font-size:14px;font-weight:600;">${dateStr}</td>
                          </tr></table>
                        </td>
                      </tr>

                      <!-- Time -->
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                          <table width="100%"><tr>
                            <td style="color:#6b7280;font-size:14px;width:140px;">Khung giờ</td>
                            <td style="color:#4f46e5;font-size:14px;font-weight:700;">${timeValue}</td>
                          </tr></table>
                        </td>
                      </tr>

                      <!-- Clinic -->
                      ${clinicName ? `
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                          <table width="100%"><tr>
                            <td style="color:#6b7280;font-size:14px;width:140px;">Phòng khám</td>
                            <td style="color:#111827;font-size:14px;font-weight:600;">${clinicName}</td>
                          </tr></table>
                        </td>
                      </tr>` : ''}

                      <!-- Address -->
                      ${clinicAddress ? `
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                          <table width="100%"><tr>
                            <td style="color:#6b7280;font-size:14px;width:140px;">Địa chỉ</td>
                            <td style="color:#111827;font-size:14px;">${clinicAddress}</td>
                          </tr></table>
                        </td>
                      </tr>` : ''}

                      <!-- Reason -->
                      ${reason ? `
                      <tr>
                        <td style="padding:8px 0;">
                          <table width="100%"><tr>
                            <td style="color:#6b7280;font-size:14px;width:140px;">Lý do khám</td>
                            <td style="color:#111827;font-size:14px;">${reason}</td>
                          </tr></table>
                        </td>
                      </tr>` : ''}

                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CONFIRM BUTTON -->
          <tr>
            <td style="padding:0 40px 36px;text-align:center;">
              <p style="color:#6b7280;font-size:14px;margin:0 0 20px;line-height:1.6;">
                Bấm nút bên dưới để xác nhận bạn sẽ đến khám đúng giờ.
              </p>
              <a href="${confirmLink}"
                style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;
                  text-decoration:none;padding:14px 40px;border-radius:10px;font-size:16px;
                  font-weight:700;letter-spacing:0.3px;">
                Xác nhận lịch khám
              </a>
              <p style="color:#9ca3af;font-size:12px;margin:16px 0 0;">
                Link có hiệu lực trong 24 giờ
              </p>
            </td>
          </tr>

          <!-- NOTE -->
          <tr>
            <td style="padding:0 40px 30px;">
              <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px 18px;">
                <p style="margin:0;color:#92400e;font-size:13px;line-height:1.6;">
                  <strong>Lưu ý:</strong> Nếu bạn muốn hủy lịch, vui lòng vào trang
                  <strong>Lịch hẹn của tôi</strong> trên hệ thống ít nhất 2 giờ trước giờ khám.
                </p>
              </div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
                Email này được gửi tự động từ hệ thống HealthConnect.<br/>
                Vui lòng không trả lời email này.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

// ===== GỬI EMAIL ĐẶT LỊCH =====
let sendBookingConfirmEmail = async (data) => {
  try {
    const html = buildBookingEmailHTML(data);
    await transporter.sendMail({
      from: `"HealthConnect" <${process.env.EMAIL_APP}>`,
      to: data.patientEmail,
      subject: `[HealthConnect] Xác nhận lịch khám - ${data.dateStr}`,
      html
    });
    console.log(`Email sent to ${data.patientEmail}`);
    return true;
  } catch (e) {
    console.error('Send email error:', e.message);
    return false; // Không throw - lỗi email không nên block booking
  }
};

// ===== GỬI EMAIL KHI HỦY LỊCH =====
let sendCancelEmail = async (data) => {
  try {
    const html = `
<!DOCTYPE html>
<html lang="vi">
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f9;padding:40px 20px;">
  <table width="600" cellpadding="0" cellspacing="0"
    style="background:#fff;border-radius:16px;overflow:hidden;margin:0 auto;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <tr>
      <td style="background:#ef4444;padding:30px 40px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:22px;">Lịch khám đã được hủy</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:30px 40px;">
        <p style="color:#374151;font-size:15px;margin:0 0 16px;">
          Xin chào <strong>${data.patientName}</strong>,
        </p>
        <p style="color:#6b7280;font-size:14px;margin:0 0 20px;line-height:1.7;">
          Lịch khám của bạn với <strong>${data.doctorName}</strong>
          vào lúc <strong>${data.timeValue}</strong>, ngày <strong>${data.dateStr}</strong>
          đã được hủy thành công.
        </p>
        <p style="color:#6b7280;font-size:14px;margin:0;">
          Nếu bạn muốn đặt lịch khác, hãy truy cập lại hệ thống HealthConnect.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 40px;text-align:center;">
        <p style="margin:0;color:#9ca3af;font-size:12px;">Email tự động từ HealthConnect.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: `"HealthConnect" <${process.env.EMAIL_APP}>`,
      to: data.patientEmail,
      subject: `[HealthConnect] Lịch khám đã hủy - ${data.dateStr}`,
      html
    });
    return true;
  } catch (e) {
    console.error('Send cancel email error:', e.message);
    return false;
  }
};
let sendMedicalRecordEmail = async (data) => {
  try {
    const html = `
<!DOCTYPE html>
<html lang="vi">
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f9;padding:40px 20px;">
  <table width="600" cellpadding="0" cellspacing="0"
    style="background:#fff;border-radius:16px;overflow:hidden;margin:0 auto;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <tr>
      <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:30px 40px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:22px;">HealthConnect</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Hồ sơ khám bệnh điện tử</p>
      </td>
    </tr>
    <tr>
      <td style="padding:30px 40px;">
        <p style="color:#374151;font-size:15px;margin:0 0 8px;">
          Xin chào <strong>${data.patientName}</strong>,
        </p>
        <p style="color:#6b7280;font-size:14px;margin:0 0 20px;line-height:1.7;">
          <strong>${data.doctorName}</strong> đã gửi cho bạn hồ sơ/đơn thuốc sau buổi khám (Mã lịch: #${data.bookingId}):
        </p>
        <div style="background:#f8fafc;border-left:4px solid #4f46e5;border-radius:8px;padding:20px 24px;white-space:pre-wrap;font-family:monospace;font-size:13px;color:#1f2937;line-height:1.8;">
${data.content}
        </div>
        <p style="color:#9ca3af;font-size:12px;margin:20px 0 0;text-align:center;">
          Vui lòng lưu giữ hồ sơ này. Liên hệ phòng khám nếu có thắc mắc.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 40px;text-align:center;">
        <p style="margin:0;color:#9ca3af;font-size:12px;">Email tự động từ HealthConnect.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
    await transporter.sendMail({
      from: `"HealthConnect" <${process.env.EMAIL_APP}>`,
      to: data.patientEmail,
      subject: `[HealthConnect] Hồ sơ khám bệnh - ${data.doctorName}`,
      html
    });
    return true;
  } catch (e) {
    console.error('Send medical record email error:', e.message);
    return false;
  }
};
// ===== EMAIL THÔNG BÁO CHỜ CHUYỂN KHOẢN =====
let sendBankTransferPendingEmail = async (data) => {
  try {
    const html = `
<!DOCTYPE html><html lang="vi">
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f9;padding:40px 20px;">
  <table width="600" cellpadding="0" cellspacing="0"
    style="background:#fff;border-radius:16px;overflow:hidden;margin:0 auto;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <tr><td style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:30px 40px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:22px;">HealthConnect</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">Chờ xác nhận thanh toán</p>
    </td></tr>
    <tr><td style="padding:30px 40px;">
      <p style="color:#374151;font-size:15px;margin:0 0 12px;">Xin chào <strong>${data.patientName}</strong>,</p>
      <p style="color:#6b7280;font-size:14px;margin:0 0 20px;line-height:1.7;">
        Chúng tôi đã nhận được yêu cầu đặt lịch của bạn với <strong>${data.doctorName}</strong>
        vào lúc <strong>${data.timeValue}</strong>, ngày <strong>${data.dateStr}</strong>.
      </p>
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:20px 24px;margin-bottom:20px;">
        <p style="margin:0 0 10px;color:#92400e;font-size:14px;font-weight:600;">Thông tin chuyển khoản</p>
        <p style="margin:4px 0;color:#78350f;font-size:14px;">Ngân hàng: <strong>MB Bank</strong></p>
        <p style="margin:4px 0;color:#78350f;font-size:14px;">Số tài khoản: <strong>0123456789</strong></p>
        <p style="margin:4px 0;color:#78350f;font-size:14px;">Tên tài khoản: <strong>PHONG KHAM HEALTHCONNECT</strong></p>
        <p style="margin:4px 0;color:#78350f;font-size:14px;">Số tiền: <strong style="color:#dc2626;">500.000 VNĐ</strong></p>
        <p style="margin:10px 0 0;color:#92400e;font-size:13px;font-weight:600;">
          Nội dung CK bắt buộc: <span style="background:#fef3c7;padding:2px 8px;border-radius:4px;">TTKHAM ${data.bookingToken?.slice(-8)?.toUpperCase()}</span>
        </p>
      </div>
      <p style="color:#ef4444;font-size:13px;margin:0;">
        ⚠ Vui lòng chuyển khoản trong vòng <strong>2 giờ</strong> để giữ lịch. Sau thời gian này lịch sẽ tự động hủy.
      </p>
    </td></tr>
    <tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 40px;text-align:center;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">Email tự động từ HealthConnect. Vui lòng không trả lời.</p>
    </td></tr>
  </table>
</body></html>`;
    await transporter.sendMail({
      from: `"HealthConnect" <${process.env.EMAIL_APP}>`,
      to: data.patientEmail,
      subject: `[HealthConnect] Vui lòng chuyển khoản để xác nhận lịch khám - ${data.dateStr}`,
      html
    });
    return true;
  } catch (e) {
    console.error('Send bank pending email error:', e.message);
    return false;
  }
};

// ===== EMAIL XÁC NHẬN ĐÃ NHẬN TIỀN =====
let sendBankTransferConfirmedEmail = async (data) => {
  try {
    const html = `
<!DOCTYPE html><html lang="vi">
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f9;padding:40px 20px;">
  <table width="600" cellpadding="0" cellspacing="0"
    style="background:#fff;border-radius:16px;overflow:hidden;margin:0 auto;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <tr><td style="background:linear-gradient(135deg,#10b981,#059669);padding:30px 40px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:22px;">HealthConnect</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">Thanh toán thành công ✓</p>
    </td></tr>
    <tr><td style="padding:30px 40px;">
      <p style="color:#374151;font-size:15px;margin:0 0 12px;">Xin chào <strong>${data.patientName}</strong>,</p>
      <p style="color:#6b7280;font-size:14px;margin:0 0 20px;line-height:1.7;">
        Chúng tôi đã nhận được thanh toán của bạn. Lịch khám với <strong>${data.doctorName}</strong>
        vào lúc <strong>${data.timeValue}</strong>, ngày <strong>${data.dateStr}</strong>
        đã được <strong style="color:#059669;">xác nhận chính thức</strong>.
      </p>
      <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:10px;padding:16px 24px;text-align:center;">
        <p style="margin:0;color:#065f46;font-size:15px;font-weight:600;">Lịch khám của bạn đã được chốt!</p>
        <p style="margin:8px 0 0;color:#047857;font-size:13px;">Vui lòng đến đúng giờ. Mang theo CMND/CCCD khi đến khám.</p>
      </div>
    </td></tr>
    <tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 40px;text-align:center;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">Email tự động từ HealthConnect. Vui lòng không trả lời.</p>
    </td></tr>
  </table>
</body></html>`;
    await transporter.sendMail({
      from: `"HealthConnect" <${process.env.EMAIL_APP}>`,
      to: data.patientEmail,
      subject: `[HealthConnect] Thanh toán thành công - Lịch khám đã được chốt`,
      html
    });
    return true;
  } catch (e) {
    console.error('Send bank confirmed email error:', e.message);
    return false;
  }
};
// ===== GỬI EMAIL ĐƠN THUỐC (PDF ATTACHMENT) =====
let sendPrescriptionEmail = async ({ patientEmail, patientName, doctorName, pdfBuffer }) => {
  try {
    await transporter.sendMail({
      from: `"HealthConnect" <${process.env.EMAIL_APP}>`,
      to: patientEmail,
      subject: `[HealthConnect] Don thuoc dien tu tu BS. ${doctorName}`,
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f9;padding:40px 20px;">
          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#fff;border-radius:16px;overflow:hidden;margin:0 auto;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            <tr><td style="background:#4f46e5;padding:30px 40px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:22px;">Don Thuoc Dien Tu</h1>
              <p style="color:#c7d2fe;margin:8px 0 0;">HealthConnect</p>
            </td></tr>
            <tr><td style="padding:32px 40px;">
              <p style="color:#374151;font-size:15px;">Xin chao <strong>${patientName}</strong>,</p>
              <p style="color:#374151;font-size:14px;line-height:1.6;">
                BS. <strong>${doctorName}</strong> da gui don thuoc dien tu cua ban qua he thong HealthConnect.<br/>
                Vui long xem file dinh kem duoi day va thuc hien theo huong dan cua bac si.
              </p>
              <div style="background:#f0f4ff;border-radius:12px;padding:16px 20px;margin:20px 0;border-left:4px solid #4f46e5;">
                <p style="margin:0;color:#4f46e5;font-weight:600;font-size:13px;">
                  📎 File don thuoc duoc dinh kem trong email nay.
                </p>
              </div>
              <p style="color:#6b7280;font-size:12px;margin-top:24px;">
                Neu co thac mac, vui long lien he phong kham hoac dat lai lich hen qua HealthConnect.
              </p>
            </td></tr>
            <tr><td style="background:#f9fafb;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:11px;">HealthConnect - He thong Y te Thong minh</p>
            </td></tr>
          </table>
        </div>`,
      attachments: [{
        filename: `don-thuoc-${Date.now()}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      }]
    });
    return true;
  } catch (e) {
    console.error('Send prescription email error:', e.message);
    return false;
  }
};

module.exports = { sendBookingConfirmEmail, sendCancelEmail, sendMedicalRecordEmail, sendBankTransferPendingEmail, sendBankTransferConfirmedEmail, sendPrescriptionEmail };