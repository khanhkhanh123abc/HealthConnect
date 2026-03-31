import userService from '../services/userServices.js';

let handleLogin = async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing email or password' });
    }
    let userData = await userService.handleUserLogin(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        user: userData.user ? userData.user : {}
    });
};

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.status(400).json({ errCode: 1, errMessage: 'Missing required parameter', users: [] });
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({ errCode: 0, errMessage: 'OK', users: users });
};

let handleCreateNewUser = async (req, res) => {
    try {
        let message = await userService.createNewUser(req.body);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server...' });
    }
};

let handleEditUser = async (req, res) => {
    try {
        let message = await userService.updateUserData(req.body);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server...' });
    }
};

let handleDeleteUser = async (req, res) => {
    try {
        if (!req.query.id) {
            return res.status(200).json({ errCode: 1, errMessage: 'Missing required parameters!' });
        }
        let message = await userService.deleteUser(req.query.id);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server...' });
    }
};

let getAllCode = async (req, res) => {
    try {
        if (!req.query.type) {
            return res.status(200).json({ errCode: 1, errMessage: 'Missing required parameters!' });
        }
        let response = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server...' });
    }
};

module.exports = {
    handleLogin,
    handleGetAllUsers,
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser,
    getAllCode,
};