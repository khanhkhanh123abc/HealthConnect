'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('Users', 'image', {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('Users', 'image', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    }
};
