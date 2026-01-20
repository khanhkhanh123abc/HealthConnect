import db from '../models/index.js';
import bcrypt from 'bcryptjs';

let hendleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);

            if (isExist) {
                // Bước 1: Chỉ tìm user theo email
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName', 'address', 'phoneNumber', 'gender'], // Lấy các trường cần thiết
                    raw: true,
                });

                if (user) {
                    // Bước 2: So sánh password từ client với password đã băm trong DB
                    let check = await bcrypt.compare(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        
                        // Xóa password trước khi gửi về client để bảo mật
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    // Trường hợp hy hữu: user bị xóa ngay sau khi check isExist
                    userData.errCode = 2;
                    userData.errMessage = `User's not found!`;
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Your's email isn't exist in our system. Please try other email!`;
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
}

let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email }
            });
            
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    hendleUserLogin: hendleUserLogin,
    checkUserEmail: checkUserEmail,
}