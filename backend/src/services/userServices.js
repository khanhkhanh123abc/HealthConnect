import db from '../models/index.js';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = async (password) => {
    return bcrypt.hashSync(password, salt);
};

const checkUserEmail = async (email) => {
    let user = await db.User.findOne({ where: { email } });
    return !!user;
};

const handleUserLogin = async (email, password) => {
    let isExist = await checkUserEmail(email);
    if (!isExist) {
        return { errCode: 1, errMessage: "Your's email isn't exist in our system. Please try other email!" };
    }

    let user = await db.User.findOne({
        where: { email },
        attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName', 'address', 'phoneNumber', 'gender', 'image'],
        raw: true,
    });

    if (!user) return { errCode: 2, errMessage: "User's not found!" };

    let check = await bcrypt.compare(password, user.password);
    if (!check) return { errCode: 3, errMessage: 'Wrong password' };

    delete user.password;
    return { errCode: 0, errMessage: 'OK', user };
};

const registerUser = async (data) => {
    let check = await checkUserEmail(data.email);
    if (check) return { errCode: 1, errMessage: 'Email này đã được sử dụng. Vui lòng thử email khác!' };

    let hashPasswordFromLib = await hashUserPassword(data.password);
    await db.User.create({
        email: data.email,
        password: hashPasswordFromLib,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phonenumber: data.phonenumber,
        gender: data.gender,
        roleId: 'R3',
    });
    return { errCode: 0, message: 'Đăng ký tài khoản thành công!' };
};

const getAllUsers = async (userId) => {
    if (userId === 'All') {
        return db.User.findAll({ attributes: { exclude: ['password'] }, raw: true });
    }
    return db.User.findOne({ where: { id: userId }, attributes: { exclude: ['password'] } });
};

const createNewUser = async (data) => {
    let check = await checkUserEmail(data.email);
    if (check) return { errCode: 1, errMessage: 'The email is already in use' };
    let hashPasswordFromBcrypt = await hashUserPassword(data.password);
    await db.User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender === '1' ? true : false,
        roleId: data.roleId
    });
    return { errCode: 0, message: 'ok create a new user successfully' };
};

const updateUserData = async (data) => {
    if (!data.id) return { errCode: 2, errMessage: 'Missing required parameters' };
    let user = await db.User.findOne({ where: { id: data.id }, raw: false });
    if (!user) return { errCode: 1, errMessage: "User's not found!" };
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.address = data.address;
    user.phoneNumber = data.phoneNumber;
    user.gender = data.gender === '1' ? true : false;
    user.roleId = data.roleId;
    user.positionId = data.positionId;
    user.image = data.image;
    await user.save();
    return { errCode: 0, message: 'Update the user succeeds!' };
};

const deleteUser = async (userId) => {
    let count = await db.User.destroy({ where: { id: userId } });
    if (count) return { errCode: 0, message: 'Delete the user succeeds!' };
    return { errCode: 1, errMessage: "User's not found!" };
};

const getAllCodeService = async (typeInput) => {
    if (!typeInput) return { errCode: 1, errMessage: 'Missing required parameters!' };
    let allcode = await db.allCode.findAll({ where: { type: typeInput } });
    return { errCode: 0, data: allcode };
};

module.exports = {
    handleUserLogin,
    checkUserEmail,
    getAllUsers,
    createNewUser,
    updateUserData,
    deleteUser,
    getAllCodeService,
    registerUser,
    hashUserPassword,
};
