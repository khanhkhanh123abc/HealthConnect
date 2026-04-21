import db from '../models/index';
import { Op } from 'sequelize';

// Symptom → Specialty name mapping (Vietnamese keywords)
const SYMPTOM_MAP = [
    // Thần kinh
    { keywords: ['dau dau', 'nhuc dau', 'chong mat', 'te tay', 'te chan', 'mat ngu', 'co giat', 'dong kinh'], specialty: 'Thần kinh' },
    { keywords: ['đau đầu', 'nhức đầu', 'chóng mặt', 'tê tay', 'tê chân', 'mất ngủ', 'co giật', 'động kinh'], specialty: 'Thần kinh' },
    // Tim mạch
    { keywords: ['dau nguc', 'hoi hop', 'kho tho', 'huyet ap', 'nhip tim', 'suy tim'], specialty: 'Tim mạch' },
    { keywords: ['đau ngực', 'hồi hộp', 'khó thở', 'huyết áp', 'nhịp tim', 'suy tim'], specialty: 'Tim mạch' },
    // Tiêu hóa
    { keywords: ['dau bung', 'tieu chay', 'tao bon', 'buon non', 'non mua', 'trao nguoc', 'viem da day'], specialty: 'Tiêu hóa' },
    { keywords: ['đau bụng', 'tiêu chảy', 'táo bón', 'buồn nôn', 'nôn mửa', 'trào ngược', 'viêm dạ dày'], specialty: 'Tiêu hóa' },
    // Da liễu
    { keywords: ['noi man', 'ngua', 'mun', 'rung toc', 'vay nen', 'nam da'], specialty: 'Da liễu' },
    { keywords: ['nổi mẩn', 'ngứa', 'mụn', 'rụng tóc', 'vảy nến', 'nấm da'], specialty: 'Da liễu' },
    // Tai Mũi Họng
    { keywords: ['dau hong', 'so mui', 'nghet mui', 'u tai', 'ho', 'viem amidan', 'mat tieng'], specialty: 'Tai Mũi Họng' },
    { keywords: ['đau họng', 'sổ mũi', 'nghẹt mũi', 'ù tai', 'ho', 'viêm amidan', 'mất tiếng'], specialty: 'Tai Mũi Họng' },
    // Mắt
    { keywords: ['mo mat', 'dau mat', 'do mat', 'cham nuoc mat', 'glocom'], specialty: 'Mắt' },
    { keywords: ['mờ mắt', 'đau mắt', 'đỏ mắt', 'chảy nước mắt', 'tăng nhãn áp'], specialty: 'Mắt' },
    // Cơ xương khớp
    { keywords: ['dau lung', 'dau khop', 'viem khop', 'dau co', 'dau vai', 'dau co'], specialty: 'Cơ xương khớp' },
    { keywords: ['đau lưng', 'đau khớp', 'viêm khớp', 'đau cơ', 'đau vai', 'đau cổ'], specialty: 'Cơ xương khớp' },
    // Nhi khoa
    { keywords: ['tre em', 'tre so sinh', 'nhi', 'con nho', 'be'], specialty: 'Nhi khoa' },
    { keywords: ['trẻ em', 'trẻ sơ sinh', 'nhi', 'con nhỏ', 'bé'], specialty: 'Nhi khoa' },
    // Nội tiết
    { keywords: ['tieu duong', 'beo phi', 'tuyen giap', 'noi tiet'], specialty: 'Nội tiết' },
    { keywords: ['tiểu đường', 'béo phì', 'tuyến giáp', 'nội tiết'], specialty: 'Nội tiết' },
    // Sản phụ khoa
    { keywords: ['phu khoa', 'kinh nguyet', 'mang thai', 'sinh san', 'u nang'], specialty: 'Sản phụ khoa' },
    { keywords: ['phụ khoa', 'kinh nguyệt', 'mang thai', 'sinh sản', 'u nang'], specialty: 'Sản phụ khoa' },
    // Răng hàm mặt
    { keywords: ['dau rang', 'sau rang', 'rang khon', 'nhay cam', 'ham rang'], specialty: 'Răng hàm mặt' },
    { keywords: ['đau răng', 'sâu răng', 'răng khôn', 'nhạy cảm', 'hàm răng'], specialty: 'Răng hàm mặt' },
];

const findMatchedSpecialties = (query) => {
    const q = query.toLowerCase().trim();
    const matched = new Set();
    for (const entry of SYMPTOM_MAP) {
        for (const kw of entry.keywords) {
            if (q.includes(kw) || kw.includes(q)) {
                matched.add(entry.specialty);
                break;
            }
        }
    }
    return [...matched];
};

let globalSearch = async (req, res) => {
    try {
        const q = (req.query.q || '').trim();
        if (!q || q.length < 2) {
            return res.status(200).json({ errCode: 0, doctors: [], specialties: [] });
        }

        // ── Search doctors by name ───────────────────────────────
        const doctors = await db.User.findAll({
            where: {
                roleId: 'R2',
                [Op.or]: [
                    { firstName: { [Op.like]: `%${q}%` } },
                    { lastName:  { [Op.like]: `%${q}%` } },
                ]
            },
            attributes: ['id', 'firstName', 'lastName', 'image', 'positionId'],
            include: [{ model: db.allCode, as: 'positionData', attributes: ['value'] }],
            limit: 5,
            raw: false
        });

        // ── Search specialties ───────────────────────────────────
        // 1. By name (direct match)
        const byName = await db.Specialty.findAll({
            where: { name: { [Op.like]: `%${q}%` } },
            attributes: ['id', 'name'],
        });

        // 2. By symptom keyword mapping
        const matchedNames = findMatchedSpecialties(q);
        let bySymptom = [];
        if (matchedNames.length > 0) {
            bySymptom = await db.Specialty.findAll({
                where: { name: { [Op.in]: matchedNames } },
                attributes: ['id', 'name'],
            });
        }

        // Merge & deduplicate specialties
        const specialtyMap = new Map();
        [...byName, ...bySymptom].forEach(s => specialtyMap.set(s.id, s));
        const specialties = [...specialtyMap.values()].slice(0, 5);

        return res.status(200).json({
            errCode: 0,
            doctors: doctors.map(d => ({
                id: d.id,
                name: `${d.lastName || ''} ${d.firstName || ''}`.trim(),
                position: d.positionData?.value || '',
                image: d.image || '',
            })),
            specialties: specialties.map(s => ({ id: s.id, name: s.name })),
        });
    } catch (e) {
        console.error('[Search] error:', e.message);
        return res.status(200).json({ errCode: -1, errMessage: 'Search error' });
    }
};

module.exports = { globalSearch };
