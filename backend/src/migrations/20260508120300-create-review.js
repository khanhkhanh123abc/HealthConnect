'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Reviews', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            doctorId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'Users', key: 'id' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            patientId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'Users', key: 'id' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            bookingId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'booking', key: 'id' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            rating: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            comment: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        await queryInterface.addIndex('Reviews', ['doctorId'], { name: 'reviews_doctor_id_idx' });
        await queryInterface.addIndex('Reviews', ['patientId'], { name: 'reviews_patient_id_idx' });
        await queryInterface.addConstraint('Reviews', {
            fields: ['bookingId'],
            type: 'unique',
            name: 'reviews_booking_id_unique'
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('Reviews');
    }
};
