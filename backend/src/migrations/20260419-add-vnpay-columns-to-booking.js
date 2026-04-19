'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const tableDesc = await queryInterface.describeTable('booking');

        // Các cột cần thêm (nếu chưa tồn tại)
        const columnsToAdd = {
            reason: { type: Sequelize.TEXT, allowNull: true },
            token: { type: Sequelize.STRING, allowNull: true },
            paymentMethod: { type: Sequelize.STRING, allowNull: true, defaultValue: 'CASH' },
            price: { type: Sequelize.INTEGER, allowNull: true },
            vnpTransactionNo: { type: Sequelize.STRING, allowNull: true },
            vnpTransactionDate: { type: Sequelize.STRING, allowNull: true },
            vnpTxnRef: { type: Sequelize.STRING, allowNull: true },
            refundAmount: { type: Sequelize.INTEGER, allowNull: true },
            refundStatus: { type: Sequelize.STRING, allowNull: true },
        };

        for (const [colName, colDef] of Object.entries(columnsToAdd)) {
            if (!tableDesc[colName]) {
                await queryInterface.addColumn('booking', colName, colDef);
                console.log(`[Migration] Added column '${colName}' to booking table`);
            } else {
                console.log(`[Migration] Column '${colName}' already exists, skipping`);
            }
        }
    },

    async down(queryInterface, Sequelize) {
        const columnsToRemove = [
            'reason', 'token', 'paymentMethod', 'price',
            'vnpTransactionNo', 'vnpTransactionDate', 'vnpTxnRef',
            'refundAmount', 'refundStatus',
        ];

        for (const colName of columnsToRemove) {
            try {
                await queryInterface.removeColumn('booking', colName);
            } catch (e) {
                console.log(`[Migration] Column '${colName}' not found, skipping removal`);
            }
        }
    }
};
