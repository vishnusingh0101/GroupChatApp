const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const usergroup = sequelize.define('usergroup', {
    isadmin: {
        type: Sequelize.BOOLEAN,
    }
});

module.exports = usergroup;