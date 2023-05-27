const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoute = require('./routes/user');
const chatsRoute = require('./routes/chats');

const sequelize = require('./util/database');

const user = require('./model/user')
const chats = require('./model/chats')

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

user.hasMany(chats);
chats.belongsTo(user);

sequelize.sync()
.then(result =>{
    app.listen(3000);
})
.catch(err => console.log(err));