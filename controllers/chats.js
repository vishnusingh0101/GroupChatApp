const Chats = require('../model/chats');
const sequelize = require('../util/database');

const send = async (req, res, next) => {
    const t = await sequelize.transaction();
    console.log(req.body);
    try {
        const chat = await Chats.create({
            message: req.body.chatInput,
            userId: req.user.id,
        }, { transaction: t });
        await t.commit();
        res.status(200).json({ message: chat, status: true });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err, status: false, message: 'server error try again' });
    }
}

module.exports = {
    send
}