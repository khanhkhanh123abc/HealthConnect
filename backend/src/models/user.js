'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasOne(models.Markdown, { foreignKey: 'doctorId' });
            User.hasMany(models.Doctor_Clinic_Specialty, { foreignKey: 'doctorId' });
            User.belongsTo(models.allCode, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData' });
            User.belongsTo(models.allCode, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' });
            User.hasOne(models.Doctor_Info, { foreignKey: 'doctorId' });
            User.hasMany(models.Review, { foreignKey: 'doctorId', as: 'doctorReviews' });
            User.hasMany(models.Review, { foreignKey: 'patientId', as: 'patientReviews' });
        }
    }
    User.init({
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        address: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        gender: DataTypes.BOOLEAN,
        image: DataTypes.TEXT,
        roleId: DataTypes.STRING,
        positionId: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'User'
    });
    return User;
};
