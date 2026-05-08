import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

// Verify "Authorization: Bearer <token>". Decoded payload exposed at req.user.
const verifyToken = (req, res, next) => {
    const header = req.headers.authorization || req.headers.Authorization || '';
    const match = /^Bearer\s+(.+)$/i.exec(header);
    if (!match) {
        return res.status(401).json({ errCode: 401, errMessage: 'Unauthorized' });
    }
    const token = match[1].trim();

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        // Production-grade misconfiguration: refuse rather than verify with a default.
        logger.error('[auth] JWT_SECRET is not set');
        return res.status(500).json({ errCode: -1, errMessage: 'Auth not configured' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = {
            id: decoded.id,
            roleId: decoded.roleId,
            email: decoded.email
        };
        return next();
    } catch (e) {
        return res.status(401).json({ errCode: 401, errMessage: 'Unauthorized' });
    }
};

// Factory: middleware that ensures req.user.roleId is in the allowed list.
const requireRole = (...allowedRoles) => (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.roleId)) {
        return res.status(403).json({ errCode: 403, errMessage: 'Forbidden' });
    }
    return next();
};

module.exports = { verifyToken, requireRole };
