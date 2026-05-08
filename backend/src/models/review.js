'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {
            Review.belongsTo(models.User, { foreignKey: 'doctorId', as: 'doctor' });
            Review.belongsTo(models.User, { foreignKey: 'patientId', as: 'patient' });
            Review.belongsTo(models.Bookings, { foreignKey: 'bookingId', as: 'booking' });
        }
    }
    Review.init({
        doctorId: { type: DataTypes.INTEGER, allowNull: false },
        patientId: { type: DataTypes.INTEGER, allowNull: false },
        bookingId: { type: DataTypes.INTEGER, allowNull: false },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1, max: 5 }
        },
        comment: { type: DataTypes.TEXT, allowNull: true }
    }, {
        sequelize,
        modelName: 'Review'
    });
    return Review;
};
