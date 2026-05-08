'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SymptomKeyword extends Model {
        static associate(models) {
            SymptomKeyword.belongsTo(models.Specialty, { foreignKey: 'specialtyId' });
        }
    }
    SymptomKeyword.init({
        keyword: { type: DataTypes.STRING, allowNull: false },
        specialtyId: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        sequelize,
        modelName: 'SymptomKeyword',
        hooks: {
            beforeValidate: (instance) => {
                if (typeof instance.keyword === 'string') {
                    instance.keyword = instance.keyword.trim().toLowerCase();
                }
            }
        }
    });
    return SymptomKeyword;
};
