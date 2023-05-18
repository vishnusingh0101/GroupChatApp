const User = require('../model/user');
const bcrypt = require('bcrypt');

const signup = async (req, res, next) => {
    try {
        const { name, mail, phone, password } = req.body;
        const existingmail = await User.findOne({where: {mail}});
        if(existingmail) {
            return res.status(201).json({message: "Email already exist!"});
        }
        const existingphone = await User.findOne({where: {phone}});
        if(existingphone) {
            return res.status(201).json({message: "Phone Number already exist!"});
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

module.exports = {
    signup
};