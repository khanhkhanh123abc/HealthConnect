'use strict';

// All booking columns referenced by application code (reason, token,
// paymentMethod, refundAmount, refundStatus, etc.) were added by the earlier
// migration 20260419-add-vnpay-columns-to-booking.js. This migration only
// layers on the indexes that the search-feature and security-hardening pass
// require, plus a unique constraint on the email-confirmation token to make
// SequelizeUniqueConstraintError fire reliably on duplicate inserts.

const TABLE = 'booking';

const safeAddIndex = async (queryInterface, opts) => {
    try {
        await queryInterface.addIndex(TABLE, opts);
    } catch (e) {
        if (/Duplicate key name|already exists/i.test(e.message || '')) {
            console.log(`[Migration] Index '${opts.name}' already exists, skipping`);
        } else {
            throw e;
        }
    }
};

const safeRemoveIndex = async (queryInterface, name) => {
    try {
        await queryInterface.removeIndex(TABLE, name);
    } catch (e) {
        console.log(`[Migration] Index '${name}' not found, skipping removal`);
    }
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        // Unique index on token: any duplicate insert (race) raises
        // SequelizeUniqueConstraintError which createBooking maps to errCode 4.
        await safeAddIndex(queryInterface, {
            fields: ['token'],
            unique: true,
            name: 'booking_token_unique_idx'
        });

        // Composite index for the duplicate-active-booking check inside
        // createBooking (patient + doctor + date + timeType + statusId).
        await safeAddIndex(queryInterface, {
            fields: ['patientId', 'doctorId', 'date', 'timeType', 'statusId'],
            name: 'booking_active_lookup_idx'
        });
    },

    async down(queryInterface) {
        await safeRemoveIndex(queryInterface, 'booking_token_unique_idx');
        await safeRemoveIndex(queryInterface, 'booking_active_lookup_idx');
    }
};
