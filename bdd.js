import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize('sqlite:./db/db.db')

export const IP = sequelize.define('IP', {
    query: {
        type: DataTypes.STRING
    },
    countryCode: {
        type: DataTypes.STRING
    },
    country: {
        type: DataTypes.STRING
    },
    region: {
        type: DataTypes.STRING
    },
    regionName: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    zip: {
        type: DataTypes.STRING
    },
    lat: {
        type: DataTypes.DOUBLE
    },
    lon: {
        type: DataTypes.DOUBLE
    },
    timezone: {
        type: DataTypes.STRING
    },
    isp: {
        type: DataTypes.STRING
    },
    org: {
        type: DataTypes.STRING,
    },
    as: {
        type: DataTypes.STRING,
    },
    continent: {
        type: DataTypes.STRING,
    },
    continentCode: {
        type: DataTypes.STRING,
    },
    district: {
        type: DataTypes.STRING,
    },
    asname: {
        type: DataTypes.STRING,
    },
    reverse: {
        type: DataTypes.STRING,
    },
    mobile: {
        type: DataTypes.BOOLEAN,
    },
    proxy: {
        type: DataTypes.BOOLEAN,
    },
    hosting: {
        type: DataTypes.BOOLEAN,
    },
});

export async function initBDD() {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données réussie !');

        await sequelize.sync({ force: true });
        console.log("Base de données créé avec succès !")
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}