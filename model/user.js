const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull:false,
    },
    mail: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: Sequelize.BIGINT,
        allowNull:false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }

});

module.exports = User;