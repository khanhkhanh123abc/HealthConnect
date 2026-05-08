'use strict';

// Initial English seed: keywords grouped by specialty name.
// On migration the script attempts to find each specialty by case-insensitive
// name match. Rows with no matching specialty are skipped (admin can re-add
// later through the symptom-keyword management UI).
const SEED = [
    { specialty: 'Neurology',        keywords: ['headache', 'migraine', 'dizziness', 'numbness', 'insomnia', 'seizure', 'epilepsy'] },
    { specialty: 'Cardiology',       keywords: ['chest pain', 'palpitations', 'shortness of breath', 'blood pressure', 'heart rate', 'heart failure'] },
    { specialty: 'Gastroenterology', keywords: ['stomach pain', 'diarrhea', 'constipation', 'nausea', 'vomiting', 'reflux', 'gastritis'] },
    { specialty: 'Dermatology',      keywords: ['rash', 'itching', 'acne', 'hair loss', 'psoriasis', 'skin fungus'] },
    { specialty: 'Ent',              keywords: ['sore throat', 'runny nose', 'stuffy nose', 'tinnitus', 'cough', 'tonsillitis', 'voice loss'] },
    { specialty: 'Ophthalmology',    keywords: ['blurred vision', 'eye pain', 'red eye', 'watery eye', 'glaucoma'] },
    { specialty: 'Orthopedics',      keywords: ['back pain', 'joint pain', 'arthritis', 'muscle pain', 'shoulder pain', 'neck pain'] },
    { specialty: 'Pediatrics',       keywords: ['child', 'newborn', 'infant', 'kid', 'baby'] },
    { specialty: 'Endocrinology',    keywords: ['diabetes', 'obesity', 'thyroid', 'hormone'] },
    { specialty: 'Obstetrics',       keywords: ['gynecology', 'menstruation', 'pregnancy', 'fertility', 'cyst'] },
    { specialty: 'Dentistry',        keywords: ['toothache', 'cavity', 'wisdom tooth', 'sensitive teeth', 'gum'] }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('SymptomKeywords', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            keyword: {
                type: Sequelize.STRING,
                allowNull: false
            },
            specialtyId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'Specialties', key: 'id' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
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

        await queryInterface.addIndex('SymptomKeywords', ['keyword'], {
            name: 'symptom_keywords_keyword_idx'
        });
        await queryInterface.addIndex('SymptomKeywords', ['specialtyId'], {
            name: 'symptom_keywords_specialty_id_idx'
        });

        // Seed: look up each specialty by name (case-insensitive); insert keyword rows.
        const now = new Date();
        for (const group of SEED) {
            const [matches] = await queryInterface.sequelize.query(
                'SELECT id FROM Specialties WHERE LOWER(name) = LOWER(:n) LIMIT 1',
                { replacements: { n: group.specialty } }
            );
            if (!matches.length) continue;
            const specialtyId = matches[0].id;
            const rows = group.keywords.map(kw => ({
                keyword: kw.toLowerCase(),
                specialtyId,
                createdAt: now,
                updatedAt: now
            }));
            await queryInterface.bulkInsert('SymptomKeywords', rows);
        }
    },

    async down(queryInterface) {
        await queryInterface.dropTable('SymptomKeywords');
    }
};
