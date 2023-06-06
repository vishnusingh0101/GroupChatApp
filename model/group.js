const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const group = sequelize.define('group',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
    groupname: Sequelize.STRING,
    createBy: Sequelize.STRING,
})

module.exports = group;