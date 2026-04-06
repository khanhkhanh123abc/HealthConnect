'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Bookings extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Booking belongsTo User (doctor)
            Bookings.belongsTo(models.User, {
                foreignKey: 'doctorId',
                as: 'doctorBookingData'
            });

            // Booking belongsTo allCode (timeType)
            Bookings.belongsTo(models.allCode, {
                foreignKey: 'timeType',
                as: 'timeTypeDataBooking'
            });

            // Booking belongsTo allCode (status)
            Bookings.belongsTo(models.allCode, {
                foreignKey: 'statusId',
                as: 'statusBookingData'
            });
            
        }
    }
    Bookings.init({
        statusId: DataTypes.STRING,
        doctorId: DataTypes.INTEGER,
        patientId: DataTypes.INTEGER,
        date: DataTypes.DATE,
        timeType: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Bookings',
        tableName: 'booking',
    });
    return Bookings;
};