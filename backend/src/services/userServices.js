import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';

const salt = bcrypt.genSaltSync(10);

const ACTIVE_BOOKING_STATUSES = ['S1', 'S2'];

const TOKEN_TTL = '7d';

const signToken = (user) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not set');
    }
    return jwt.sign(
        { id: user.id, roleId: user.roleId, email: user.email },
        secret,
        { expiresIn: TOKEN_TTL }
    );
};

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
    const token = signToken(user);
    return { errCode: 0, errMessage: 'OK', user, token };
};

const registerUser = async (data) => {
    let check = await checkUserEmail(data.email);
    if (check) return { errCode: 1, errMessage: 'This email is already registered. Please try another email.' };

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
    return { errCode: 0, message: 'Account registration successful!' };
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

const updateUserData = async (data, requesterRoleId) => {
    if (!data.id) return { errCode: 2, errMessage: 'Missing required parameters' };
    let user = await db.User.findOne({ where: { id: data.id }, raw: false });
    if (!user) return { errCode: 1, errMessage: "User's not found!" };
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.address = data.address;
    user.phoneNumber = data.phoneNumber;
    user.gender = data.gender === '1' ? true : false;
    // Only an admin caller may change the user's roleId.
    if (data.roleId && requesterRoleId === 'R1') user.roleId = data.roleId;
    user.positionId = data.positionId;
    user.image = data.image;
    await user.save();
    return { errCode: 0, message: 'Update the user succeeds!' };
};

// Defensive delete: block when active bookings exist; otherwise cascade-clean
// non-FK-enforced satellite tables before destroying the user. Reviews are
// removed automatically through the Reviews FK CASCADE constraint.
const deleteUser = async (userId) => {
    if (!userId) return { errCode: 1, errMessage: 'Missing user id' };

    const user = await db.User.findByPk(userId);
    if (!user) return { errCode: 1, errMessage: "User's not found!" };

    const bookingWhere = user.roleId === 'R2'
        ? { doctorId: userId, statusId: { [Op.in]: ACTIVE_BOOKING_STATUSES } }
        : user.roleId === 'R3'
            ? { patientId: userId, statusId: { [Op.in]: ACTIVE_BOOKING_STATUSES } }
            : null;

    if (bookingWhere) {
        const activeCount = await db.Bookings.count({ where: bookingWhere });
        if (activeCount > 0) {
            const noun = user.roleId === 'R2' ? 'doctor' : 'patient';
            return {
                errCode: 2,
                errMessage: `This ${noun} has ${activeCount} active booking(s). Cancel or complete them before deleting.`
            };
        }
    }

    const t = await db.sequelize.transaction();
    try {
        if (user.roleId === 'R2') {
            await Promise.all([
                db.Markdown.destroy({ where: { doctorId: userId }, transaction: t }),
                db.Doctor_Info.destroy({ where: { doctorId: userId }, transaction: t }),
                db.Doctor_Clinic_Specialty.destroy({ where: { doctorId: userId }, transaction: t }),
                db.Schedule.destroy({ where: { doctorId: userId }, transaction: t })
            ]);
        }
        await user.destroy({ transaction: t });
        await t.commit();
        return { errCode: 0, message: 'Delete the user succeeds!' };
    } catch (err) {
        await t.rollback();
        logger.error({ err }, '[deleteUser]');
        throw err;
    }
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
    signToken,
};
