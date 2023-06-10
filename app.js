const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoute = require('./routes/user');
const chatsRoute = require('./routes/chats');
const groupRoute = require('./routes/group');

const sequelize = require('./util/database');

const user = require('./model/user')
const chats = require('./model/chats')
const group = require('./model/group')
const usergroup = require('./model/userGroup')

const app = express();

app.use(cors({
    // origin: 'http://127.0.0.1:5500',
    // origin:'http://localhost:3000',
    // credentials:true,            //access-control-allow-credentials:true
    // optionSuccessStatus:200
}));

app.use(bodyParser.json({extended: false}));

app.use(userRoute);
app.use(chatsRoute);
app.use(groupRoute);

user.hasMany(chats);
chats.belongsTo(user);

group.hasMany(chats);
chats.belongsTo(group);

user.belongsToMany(group, {through: usergroup});
group.belongsToMany(user, {through: usergroup, foreignKey: 'groupId' });

sequelize.sync()
.then(result =>{
    app.listen(3000);
})
.catch(err => console.log(err));