const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const archiveChat = sequelize.define('archivechats',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: true,
        autoIncrement: true,
    },
    name: Sequelize.STRING,
    message: {
        type: Sequelize.STRING
    },
    URL:{
        type: Sequelize.STRING,
    },
    link: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    }
});

module.exports = archiveChat;