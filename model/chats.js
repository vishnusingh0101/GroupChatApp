const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const chats = sequelize.define('chats',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: true,
        autoIncrement: true,
    },
    name: Sequelize.STRING,
    message: {
        type: Sequelize.STRING
    }
});

module.exports = chats;