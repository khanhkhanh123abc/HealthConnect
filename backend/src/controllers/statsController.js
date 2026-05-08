import statsService from '../services/statsService';
import logger from '../utils/logger.js';

let getAdminStats = async (req, res) => {
    try {
        let data = await statsService.getAdminStats();
        return res.status(200).json(data);
    } catch (e) {
        logger.error('[Stats] admin error:', e);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

let getDoctorStats = async (req, res) => {
    try {
        if (!req.query.doctorId) {
            return res.status(400).json({ errCode: 1, errMessage: 'Missing doctorId' });
        }
        // Doctor caller can only read their own stats. Admin can read anyone's.
        if (req.user?.roleId === 'R2' && Number(req.user.id) !== Number(req.query.doctorId)) {
            return res.status(403).json({ errCode: 403, errMessage: 'Forbidden' });
        }
        let data = await statsService.getDoctorStats(req.query.doctorId);
        return res.status(200).json(data);
    } catch (e) {
        logger.error('[Stats] doctor error:', e);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

module.exports = { getAdminStats, getDoctorStats };
