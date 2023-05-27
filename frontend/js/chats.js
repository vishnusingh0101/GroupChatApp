const lastId = localStorage.getItem('lastId');
const localmessages = localStorage.getItem('localmessages');

setInterval(async () => {
        const token = localStorage.getItem('token');
        
        
        const response = await axios.get(`http://localhost:3000/msg?lastId=${lastId}`, { headers: { "Authorization": token } });
        const messagebox = document.getElementById('messagebox');

        if(localmessages === null) {
            response.data.message = response.data.message.slice(-10);
        }
        if (response.data.status === true) {
            for (let message of response.data.message) {
                setMessageInBox(message);
            }
        }
        const lastMsg = response.data.message.length;
        localStorage.setItem('lastId', lastMsg);

        const arrayString = JSON.stringify(response.data.message);
        localStorage.setItem('localmessages', arrayString);

        messagebox.scrollTop = messagebox.scrollHeight;
}, 1000);



async function send(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const chatInput = document.getElementById('chat-input').value;
    const obj = { chatInput };
    const response = await axios.post('http://localhost:3000/send', obj, { headers: { "Authorization": token } })
    if (response.data.status === true) {
        setMessageInBox(response.data.message);
        document.getElementById('chat-input').value = '';
    }
}

function setMessageInBox(obj) {

    const messagebox = document.getElementById('messagebox');
    if(document.getElementsByClassName('msg').length > 9) {
        messagebox.removeChild(document.getElementsByClassName('msg')[0]);
    }
    const id = localStorage.getItem('userId');

    const name = document.createElement('div');
    name.classList = 'name';

    const message = document.createElement('div');

    const messagecontent = document.createElement('div');
    messagecontent.classList = 'messagecontent';

    if (obj.userId == id) {
        name.innerText = 'You:';
        message.classList = 'messageright msg'
    } else {
        name.innerText = obj.name;
        message.classList = 'messageleft msg';
    }
    messagecontent.innerText = obj.message;

    message.appendChild(name);
    message.appendChild(messagecontent);


    messagebox.appendChild(message);
    messagebox.scrollTop = messagebox.scrollHeight;
}