const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const signup = async (req, res, next) => {
    try {
        const { name, mail, phone, password } = req.body;
        const existingmail = await User.findOne({where: {mail}});
        if(existingmail) {
            return res.status(409).json({success: false, message: "Email already exist!"});
        }
        const existingphone = await User.findOne({where: {phone}});
        if(existingphone) {
            return res.status(409).json({success: false, message: "Phone Number already exist!"});
        }
        bcrypt.hash(password, 10, async (err, hash) => {
            await User.create({name, mail, phone, password:hash});
            return res.status(201).json({message: "Created new user"});
        })
    }
    catch(err) {
        res.status(500).json({error: err});
    }
};

const signin = async (req, res, next) => {
    const { mail, password } = req.body;
    const user = await User.findOne({where: {mail}});
    console.log(user);
    if(user) {
        bcrypt.compare(password, user.password, (err, result) => {
            if(err) {
                res.status(201).json({message: "Try again "})
            }
            if(result == true) {
                res.status(200).json({success: true, token: generateToken(user.id, user.name), message: "Successfully Logged In"});
            }else{
                res.status(401).json({success: false, message: "Incorrect Password"})
            }
        })
    }else{
        res.status(404).json({success:false, message: "User not found"})
    }
    
};

function generateToken(id, name) {
    return jwt.sign({id, name}, process.env.JWT_TOKEN);
}

module.exports = {
    signup,
    signin
};