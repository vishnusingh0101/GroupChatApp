const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const group = sequelize.define('group',{
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: Sequelize.STRING,
})