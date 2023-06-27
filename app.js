const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const http = require('http');
const {Server} = require('socket.io');

const userRoute = require('./routes/user');
const chatsRoute = require('./routes/chats');
const groupRoute = require('./routes/group');

const sequelize = require('./util/database');

const user = require('./model/user')
const chats = require('./model/chats')
const group = require('./model/group')
const usergroup = require('./model/userGroup')


const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection',socket=>{
    console.log('connected to server');
    socket.on('ingroup', (group)=>{
        socket.join(group);
    });
    socket.on('sendmessage',(data, group)=>{
        console.log(data);
            io.to(group).emit('groupmsg', data);
    });

    socket.on('removeuser',data=>{
        io.emit('removeusersuccess',data);
    });

    socket.on('join-user',data=>{
        io.emit('joinsuccess',data)
    });

    socket.on('newAdmin',data=>{
        io.emit('newAminsuccess',data);
    });

    socket.on('showNewGroup',data=>{
        io.emit('displaysuccess',data)

    });

    socket.on('deletegroup',data=>{
        io.emit('deletesuccess', data);
    });
});




app.use(cors({
    // origin: 'http://127.0.0.1:5500',
    // origin:'http://13.210.87.174:3000',
    // credentials:true,            //access-control-allow-credentials:true
    // optionSuccessStatus:200
}));
app.use(bodyParser.json({ extended: false }));

app.use(userRoute);
app.use(chatsRoute);
app.use(groupRoute);
app.use((req, res) => {
    res.sendFile(path.join(__dirname, `frontend/${req.url}`))
});




user.hasMany(chats);
chats.belongsTo(user);

group.hasMany(chats);
chats.belongsTo(group);

user.belongsToMany(group, { through: usergroup });
group.belongsToMany(user, { through: usergroup, foreignKey: 'groupId' });


sequelize.sync()
    .then(result => {
        server.listen(3000);
    })
    .catch(err => console.log(err));