'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Specialty extends Model {
        static associate(models) {
            Specialty.hasMany(models.SymptomKeyword, { foreignKey: 'specialtyId' });
        }
    }
    Specialty.init({
        name: DataTypes.STRING,
        descriptionHTML: DataTypes.TEXT,
        descriptionMarkdown: DataTypes.TEXT,
        image: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Specialty'
    });
    return Specialty;
};
