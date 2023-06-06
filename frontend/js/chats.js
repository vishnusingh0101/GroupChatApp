let lastId = localStorage.getItem('lastId');
// localStorage.setItem('groupId', 1);
let groupId = localStorage.getItem('groupId');
const localmessages = localStorage.getItem('localmessages');

window.onload = async () => {
    try {
        const sidebar = document.getElementById('sidebar');
        sidebar.innerHTML = '';
        const token = localStorage.getItem('token');
        const group = await axios.get('http://localhost:3000/getGroup', { headers: { "Authorization": token } });
        console.log(group.data.data);
        for (const grp of group.data.data) {
            const div = document.createElement('div');
            div.classList = 'Group';
            div.innerText = grp.groupname;
            div.onclick = () => getGroup(grp, div);
            sidebar.appendChild(div);
        }
        // const firstgroup = sidebar.querySelector('.Group');
        // if(firstgroup) {
        //     firstgroup.classList.add('active');
        // }
    } catch (err) {
        console.log(err);
    }
};

function getGroup(grp, div) {
    const groupElements = sidebar.getElementsByClassName('Group');
    for(groupEl of groupElements) {
        groupEl.classList.remove('active');
    }
    div.classList.add('active');
    localStorage.setItem('groupId', grp.id);
    document.getElementById('messagebox').innerHTML = '';
    let lastId = null;
    localStorage.setItem('lastId', lastId);
    localStorage.setItem('localmessages', '');

    //head grpname
    const head = document.getElementById('header');
    head.style.backgroundColor = 'rgba(230, 243, 255, 0.525)';

    const grpname = document.getElementById('grpname');
    grpname.innerHTML = '';
    const h1 = document.createElement('h3');
    h1.innerText = grp.groupname;
    grpname.appendChild(h1);

    //footer
    const chatfooter = document.getElementById('chat-footer');
    chatfooter.innerHTML = '';
    chatfooter.style.backgroundColor = 'f1f0f0';
    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Type a message...';
    textarea.id = 'chat-input';
    const sendbutton = document.createElement('button');
    sendbutton.innerText = 'Send';
    sendbutton.onclick = send;

    chatfooter.appendChild(textarea);
    chatfooter.appendChild(sendbutton);
}

setInterval(async () => {
    let groupId = localStorage.getItem('groupId');
    let lastId = localStorage.getItem('lastId');
    if (groupId) {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/msg?groupId=${groupId}&lastId=${lastId}`, { headers: { "Authorization": token } });
        const messagebox = document.getElementById('messagebox');
        if (localmessages === null) {
            response.data.message = response.data.message.slice(-10);
        }
        if (response.data.status === true) {
            for (const message of response.data.message) {
                if (!isMessageExists(message.id)) {
                    setMessageInBox(message);
                    console.log(message);
                    lastId = message.id;
                }
            }
            localStorage.setItem('lastId', lastId);
            console.log(localStorage.getItem('lastId'));

            const arrayString = JSON.stringify(response.data.message);
            localStorage.setItem('localmessages', arrayString);

            messagebox.scrollTop = messagebox.scrollHeight;
        }
    }
}, 1000);

async function send(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const chatInput = document.getElementById('chat-input').value;
    const obj = {
        chatInput,
        groupId: localStorage.getItem('groupId')
    };
    const response = await axios.post('http://localhost:3000/send', obj, { headers: { "Authorization": token } });
    if (response.data.status === true) {
        setMessageInBox(response.data.message);
        lastId = lastId + 1;
        document.getElementById('chat-input').value = '';
    }
}

function setMessageInBox(obj) {
    const messagebox = document.getElementById('messagebox');
    if (document.getElementsByClassName('msg').length > 9) {
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
        message.classList = 'messageright msg';
    } else {
        name.innerText = obj.name;
        message.classList = 'messageleft msg';
    }
    messagecontent.innerText = obj.message;

    message.appendChild(name);
    message.appendChild(messagecontent);

    message.dataset.id = obj.id; // Set the ID as a custom attribute

    messagebox.appendChild(message);
    messagebox.scrollTop = messagebox.scrollHeight;
}

function isMessageExists(id) {
    const messages = document.getElementsByClassName('msg');
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].dataset.id === id) {
            return true;
        }
    }
    return false;
}

function logout() {
    localStorage.clear();
    window.location.href = '../html/signin.html';
}
