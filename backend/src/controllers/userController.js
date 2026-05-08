import userService from '../services/userServices.js';
import logger from '../utils/logger.js';

let handleLogin = async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ errCode: 1, errMessage: 'Missing email or password' });
    }
    try {
        let userData = await userService.handleUserLogin(email, password);
        const status = userData.errCode === 0 ? 200 : 401;
        return res.status(status).json({
            errCode: userData.errCode,
            errMessage: userData.errMessage,
            user: userData.user ? userData.user : {},
            token: userData.token || null
        });
    } catch (e) {
        logger.error('[handleLogin]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.status(400).json({ errCode: 1, errMessage: 'Missing required parameter', users: [] });
    }
    try {
        let users = await userService.getAllUsers(id);
        return res.status(200).json({ errCode: 0, errMessage: 'OK', users });
    } catch (e) {
        logger.error('[handleGetAllUsers]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

let handleCreateNewUser = async (req, res) => {
    try {
        let message = await userService.createNewUser(req.body);
        return res.status(200).json(message);
    } catch (e) {
        logger.error('[handleCreateNewUser]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

let handleRegister = async (req, res) => {
    try {
        let info = await userService.registerUser(req.body);
        return res.status(200).json(info);
    } catch (e) {
        logger.error('[handleRegister]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

let handleEditUser = async (req, res) => {
    try {
        const requesterRoleId = req.user?.roleId;
        let message = await userService.updateUserData(req.body, requesterRoleId);
        return res.status(200).json(message);
    } catch (e) {
        logger.error('[handleEditUser]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

let handleDeleteUser = async (req, res) => {
    try {
        if (!req.query.id) {
            return res.status(400).json({ errCode: 1, errMessage: 'Missing required parameters!' });
        }
        let message = await userService.deleteUser(req.query.id);
        return res.status(200).json(message);
    } catch (e) {
        logger.error('[handleDeleteUser]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

let getAllCode = async (req, res) => {
    try {
        if (!req.query.type) {
            return res.status(400).json({ errCode: 1, errMessage: 'Missing required parameters!' });
        }
        let response = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(response);
    } catch (e) {
        logger.error('[getAllCode]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

module.exports = {
    handleLogin,
    handleGetAllUsers,
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser,
    getAllCode,
    handleRegister
};
