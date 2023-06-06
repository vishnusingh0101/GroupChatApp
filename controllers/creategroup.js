const User = require('../model/user');
const Group = require('../model/group');

const search = async (req, res) => {
    try{
        const mail = req.body.mail;
        if(req.user.mail == mail) {
            res.status(201).json({status: false, message: 'Try different mail'});
        }else {
            const user = await User.findOne({where: {mail}});
            if(user) {
                res.status(200).json({status: true, message: 'User Found', user: user});
            }else {
                res.status(404).json({status: false, message: 'User Not Found'});
            }
        }
    }catch(err) {
        console.log(err);
        res.status(500).json({status: false, message: 'Server Not Responding Try Later'});
    }
}

const creategroup = async (req, res, next) => {
    console.log(req.user.mail);
    console.log(req.body.groupName);

    try {
        const group = await Group.create({ createBy: req.user.mail, groupname: req.body.groupName });
        console.log(group);

        const mailArray = req.body.userMailsArray;
        mailArray.push(req.user.mail);
        for (let mail of mailArray) {
            const user = await User.findOne({ where: { mail: mail } });
            if (user) {
                await user.addGroup(group, { through: { isadmin: false } });

                // Checking if the current user is creating the group
                if (user.mail === req.user.mail) {
                    await user.addGroup(group, { through: { isadmin: true } });
                }
            }
        }
        res.status(200).json({ message: 'Group created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the group' });
    }
};

const getgroup = async (req, res, next) => {
    console.log(req.user);
    const user = await User.findByPk(req.user.id, {
        include: Group
    });
    const groups = user.groups;
    res.status(200).json({ data: groups, status: true});
}


module.exports ={
    search,
    creategroup,
    getgroup,
}