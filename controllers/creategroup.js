const User = require('../model/user');
const Group = require('../model/group');
const Usergroup = require('../model/userGroup')

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

const members = async (req, res, next) => {
    const groupId = req.query.groupId;
    const group = await Group.findByPk(groupId);
    
    if (group) {
        const members = await group.getUsers();
        console.log(members);
        res.status(200).json({ data: members });
    } else {
        console.log('Group not found');
        res.status(404).json({ error: 'Group not found' });
    }
};

const remove = async (req, res, next) => {
    let isadmin = false;
    isadmin = await Usergroup.findOne({where: {
        groupId: req.query.groupId,
        userId: req.user.id,
        isadmin: true
    }});
    console.log(isadmin);
    if(isadmin){
        const val = await Usergroup.destroy({where: {
            groupId: req.query.groupId,
            userId: req.query.memberId,
        }});
        console.log(val);
        res.status(200).json({success: true, val, mail: req.user.mail});
    }else{
        res.status(201).json({success: false, val:'you dont have permision'});
    }
    
}

const makeadmin = async (req, res, next) => {
    let isadmin = false;
    isadmin = await Usergroup.findOne({where: {
        groupId: req.query.groupId,
        userId: req.user.id,
        isadmin: true
    }});
    if(isadmin) {
        const val = await Usergroup.update({isadmin:true},{where: {
            groupId: req.query.groupId,
            userId: req.query.memberId
        }});
        res.status(200).json({success: true, message:val, mail: req.user.mail});
    }else{
        res.status(201).json({success:false, message: 'You Do not have permision'})
    }
}

module.exports ={
    search,
    creategroup,
    getgroup,
    members,
    remove,
    makeadmin
}