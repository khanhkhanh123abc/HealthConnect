"use strict";

var _pdfkit = _interopRequireDefault(require("pdfkit"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// Generates prescription PDF and returns Buffer
var generatePrescriptionPdf = function generatePrescriptionPdf(data) {
  return new Promise(function (resolve, reject) {
    var doctorName = data.doctorName,
      patientName = data.patientName,
      diagnosis = data.diagnosis,
      medications = data.medications,
      instructions = data.instructions,
      date = data.date;
    var doc = new _pdfkit["default"]({
      size: 'A4',
      margin: 50
    });
    var buffers = [];
    doc.on('data', function (chunk) {
      return buffers.push(chunk);
    });
    doc.on('end', function () {
      return resolve(Buffer.concat(buffers));
    });
    doc.on('error', reject);
    var indigo = '#4f46e5';
    var gray = '#6b7280';
    var dark = '#111827';
    var red = '#dc2626';

    // ── HEADER ──────────────────────────────────────────────
    doc.rect(0, 0, 595, 90).fill(indigo);
    doc.fillColor('#ffffff').fontSize(26).font('Helvetica-Bold').text('HealthConnect', 50, 22, {
      align: 'center'
    });
    doc.fontSize(11).font('Helvetica').text('He thong Y te Thong minh', 50, 54, {
      align: 'center'
    });
    doc.fillColor(dark);

    // ── TITLE ───────────────────────────────────────────────
    doc.moveDown(3);
    doc.fontSize(18).font('Helvetica-Bold').fillColor(indigo).text('DON THUOC DIEN TU', {
      align: 'center'
    });
    doc.moveDown(0.4);
    doc.fontSize(10).font('Helvetica').fillColor(gray).text("Ngay: ".concat(date, "  |  Bac si: ").concat(doctorName), {
      align: 'center'
    });

    // ── DIVIDER ─────────────────────────────────────────────
    doc.moveDown(0.8);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#e5e7eb').lineWidth(1).stroke();
    doc.moveDown(0.8);

    // ── PATIENT INFO ─────────────────────────────────────────
    doc.fontSize(12).font('Helvetica-Bold').fillColor(dark).text('Benh nhan: ', {
      continued: true
    }).font('Helvetica').text(patientName);
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica-Bold').fillColor(dark).text('Chan doan: ', {
      continued: true
    }).font('Helvetica').fillColor(red).text(diagnosis);

    // ── MEDICATIONS ──────────────────────────────────────────
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#e5e7eb').lineWidth(1).stroke();
    doc.moveDown(0.8);
    doc.fontSize(13).font('Helvetica-Bold').fillColor(indigo).text('THUOC KE DON');
    doc.moveDown(0.5);
    medications.forEach(function (med, i) {
      var y = doc.y;
      // Pill icon background
      doc.rect(50, y, 495, 32).fillAndStroke('#f0f4ff', '#e0e7ff');
      doc.fillColor(indigo).fontSize(11).font('Helvetica-Bold').text("".concat(i + 1, ".  ").concat(med.name), 62, y + 9, {
        continued: true,
        width: 300
      });
      doc.fillColor(gray).font('Helvetica').text("  \u2014  ".concat(med.dosage), {
        width: 280
      });
      doc.moveDown(0.3);
    });

    // ── INSTRUCTIONS ─────────────────────────────────────────
    doc.moveDown(0.8);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#e5e7eb').lineWidth(1).stroke();
    doc.moveDown(0.8);
    doc.fontSize(13).font('Helvetica-Bold').fillColor(indigo).text('LOI DAN');
    doc.moveDown(0.4);
    doc.rect(50, doc.y, 495, Math.max(60, instructions.length * 0.6 + 24)).fillAndStroke('#fffbeb', '#fde68a');
    doc.fontSize(11).font('Helvetica').fillColor('#92400e').text(instructions, 62, doc.y - Math.max(60, instructions.length * 0.6 + 24) + 12, {
      width: 471,
      lineGap: 4
    });
    doc.moveDown(2);

    // ── SIGNATURE AREA ───────────────────────────────────────
    doc.fontSize(11).font('Helvetica-Bold').fillColor(dark).text('Chu ky Bac si', 390, doc.y, {
      width: 155,
      align: 'center'
    });
    doc.fontSize(10).font('Helvetica').fillColor(gray).text(doctorName, 390, doc.y + 50, {
      width: 155,
      align: 'center'
    });

    // ── FOOTER ──────────────────────────────────────────────
    var pageHeight = doc.page.height;
    doc.moveTo(50, pageHeight - 50).lineTo(545, pageHeight - 50).strokeColor('#e5e7eb').lineWidth(1).stroke();
    doc.fontSize(8).font('Helvetica').fillColor(gray).text('Don thuoc duoc tao boi he thong HealthConnect - Khong co gia tri phap ly thay the phieu kham benh.', 50, pageHeight - 38, {
      align: 'center',
      width: 495
    });
    doc.end();
  });
};
module.exports = {
  generatePrescriptionPdf: generatePrescriptionPdf
};