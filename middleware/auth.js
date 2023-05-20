const jwt = require('jsonwebtoken');
const User = require('../model/user');

const authenticate = (req, res, next) => {
    try{
        const token = req.header('Authorization');
        console.log('token', token);
        const jwtuser = jwt.verify(token, process.env.JWT_TOKEN);
        console.log(jwtuser);
        User.findByPk(jwtuser.id).then(user => {
            req.user = user;
            next();
        }).catch(err => {throw new Error(err)});
    }catch(err) {
        console.log(err);
        return res.status(401).json({success: false})
    }
}

module.exports = authenticate;