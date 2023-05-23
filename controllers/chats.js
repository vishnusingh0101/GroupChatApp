const Chats = require('../model/chats');
const sequelize = require('../util/database');

const fetchmessages = async (req, res, next) => {
    const msg = await Chats.findAll();
    res.status(200).json({message: msg, status: true});
}

const send = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const chat = await Chats.create({
            name: req.user.name,
            message: req.body.chatInput,
            userId: req.user.id,
        }, { transaction: t });
        console.log(chat);
        res.status(200).json({ message: chat, status: true });
        await t.commit();
    }catch (err) {
        await t.rollback();
        res.status(500).json({ error: err, status: false, message: 'server error try again' });
    }
}

module.exports = {
    send,
    fetchmessages
}