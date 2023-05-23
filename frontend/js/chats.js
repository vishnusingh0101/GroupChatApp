window.onload = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/msg', {headers: {"Authorization": token}});
    console.log(response.data);
    if(response.data.status === true) {
        for(let message of response.data.message){
            setMessageInBox(message);
        }
    }
}


async function send(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const chatInput = document.getElementById('chat-input').value;
    const obj = {chatInput};
    const response = await axios.post('http://localhost:3000/send', obj, {headers: {"Authorization": token}})
    if(response.data.status === true) {
        setMessageInBox(response.data.message);
        document.getElementById('chat-input').value = '';
    }
}

function setMessageInBox(obj) {
    const id = localStorage.getItem('userId');
    
    const messagebox = document.getElementById('messagebox');

    const name = document.createElement('div');
    name.classList = 'name';

    const message = document.createElement('div');

    const messagecontent = document.createElement('div');
    messagecontent.classList = 'messagecontent';

    if(obj.message.userId == id) {
        name.innerText = 'You:';
        message.classList = 'messageright'
    }else {
        name.innerText = obj.name;
        message.classList = 'messageleft';
    }
        messagecontent.innerText = obj.message;

        message.appendChild(name);
        message.appendChild(messagecontent);

        messagebox.appendChild(message);
}