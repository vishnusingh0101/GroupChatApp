const Chats = require('../model/chats');
const archiveChat = require('../model/archiveChat');

const backup = async () => {
    try {
        const data = await Chats.findAll();
        for (let i = 0; i < data.length; i++) {
            await archiveChat.create({
                name: data[i].name,
                message: data[i].message,
                URL: data[i].URL,
                link: data[i].link,
                createdAt: data[i].createdAt,
                updatedAt: data[i].updatedAt,
                userId: data[i].userId,
                groupId: data[i].groupId
            });
        }
        await Chats.destroy({
            where: {},
            truncate: true
        });
        console.log('Backup Done', Date());
    } catch (err) {
        console.log(err);
    }
}

module.exports = { backup };