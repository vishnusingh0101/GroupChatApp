const Chats = require('../model/chats');
const sequelize = require('../util/database');
const Sequelize = require('sequelize');
const S3services = require('../services/s3services');

const fetchmessages = async (req, res, next) => {
    const groupId = req.query.groupId;
    const lastId = req.query.lastId;
    let msg;
    try {
        if (lastId === null || lastId === 'null') {
            msg = await Chats.findAll({
                where: { groupId: groupId },
                order: [['id', 'DESC']],
                limit: 10
            });
        } else {
            msg = await Chats.findAll({
                where: {
                    groupId: groupId,
                    id: {
                        [Sequelize.Op.gt]: lastId
                    }
                }
            });
        }
    } catch (err) {
    }
    if (msg.length > 0) {
        res.status(200).json({ message: msg, status: true });
    } else {
        res.status(200).json({ message: [], status: false });
    }
}

const send = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const chat = await Chats.create({
            name: req.user.name,
            message: req.body.chatInput,
            userId: req.user.id,
            groupId: req.body.groupId,
        }, { transaction: t });
        res.status(200).json({ message: chat, status: true });
        await t.commit();
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err, status: false, message: 'server error try again' });
    }
}


const sendFile = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { groupId } = req.query;
        const file = req.files[0];

        const fileURL = await S3services.uploadToS3(file);

        const chat = await Chats.create(
            {
                name: req.user.name,
                message: file.originalname,
                URL: fileURL,
                userId: req.user.id,
                groupId: groupId,
                link: true,
            },
            { transaction: t }
        );

        res.status(200).json({ message: chat, status: true });

        await t.commit();
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err, status: false, message: 'Server error, please try again.' });
    }
};



module.exports = {
    send,
    fetchmessages,
    sendFile,
}