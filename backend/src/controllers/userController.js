import userService from '../services/userServices.js';

let handleLogin = async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing email or password' });
    }
    let userData = await userService.hendleUserLogin(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        user: userData.user ? userData.user : {}
    });
};
let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; // All, id
    if (!id) {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Missing required parameter',
            users: []
        });
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users: users
    });
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers
}