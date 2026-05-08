'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.addIndex('Users', ['firstName'], { name: 'users_first_name_idx' });
        await queryInterface.addIndex('Users', ['lastName'],  { name: 'users_last_name_idx' });
        await queryInterface.addIndex('Specialties', ['name'], { name: 'specialties_name_idx' });
    },

    async down(queryInterface) {
        await queryInterface.removeIndex('Users', 'users_first_name_idx').catch(() => {});
        await queryInterface.removeIndex('Users', 'users_last_name_idx').catch(() => {});
        await queryInterface.removeIndex('Specialties', 'specialties_name_idx').catch(() => {});
    }
};
