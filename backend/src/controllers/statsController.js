import statsService from '../services/statsService';

let getAdminStats = async (req, res) => {
    try {
        let data = await statsService.getAdminStats();
        return res.status(200).json(data);
    } catch (e) {
        console.error('[Stats] admin error:', e);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
};

let getDoctorStats = async (req, res) => {
    try {
        let data = await statsService.getDoctorStats(req.query.doctorId);
        return res.status(200).json(data);
    } catch (e) {
        console.error('[Stats] doctor error:', e);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
};

module.exports = { getAdminStats, getDoctorStats };
