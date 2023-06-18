// copied all this to chats.js










let userMails = new Set();
const socket = io('http://localhost:3000');

function createGroupForm() {
    const createGroupDiv = document.getElementById('createGroupDiv')
    createGroupDiv.style.display = 'flex';
}


async function searchmember(e) {
    e.preventDefault();
    console.log('worked');
    const token = localStorage.getItem('token');
    console.log(token);
    const obj = { mail: document.getElementById('searchmail').value };
    const member = await axios.post('http://localhost:3000/search', obj, { headers: { "Authorization": token } });
    
    showOnScreen(member.data.user);
}

function showOnScreen(user) {
    console.log(user);
    const list = document.getElementById('memberlist');

    const member = document.createElement('div');
    member.classList = 'member';

    const h5 = document.createElement('h5');
    h5.innerText = user.name;

    const addbutton = document.createElement('button');
    addbutton.id = 'add';
    addbutton.innerText = 'Add';
    addbutton.addEventListener('click', (event) => {
        adduser(event, user);
    });

    member.appendChild(h5);
    member.appendChild(addbutton);
    list.appendChild(member);
}

function adduser(event, user) {
    event.preventDefault();
    userMails.add(user.mail);
    console.log(userMails);
    const addbutton = event.target;
    addbutton.innerText = 'Remove';
    addbutton.style.backgroundColor = 'red';
    addbutton.removeEventListener('click', adduser);
    addbutton.addEventListener('click', (event) => {
        removeuser(event, user);
    });
}

function removeuser(event, user) {
    event.preventDefault();
    userMails.delete(user.mail);
    const addbutton = event.target;
    addbutton.innerText = 'Add';
    addbutton.style.backgroundColor = 'green';
    addbutton.removeEventListener('click', removeuser);
    addbutton.addEventListener('click', (event) => {
        adduser(event, user);
    });
}


async function createGroup(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userMailsArray = Array.from(userMails);
    const obj = {
        userMailsArray,
        groupName: document.getElementById('groupname').value,
    }
    console.log(obj);
    const group = await axios.post('http://localhost:3000/creategroup', obj, { headers: { 'Authorization': token } });
    socket.emit('showNewGroup',group.data);
    const list = document.getElementById('memberlist');
    list.innerHTML = '';
    moveback();


}

function moveback() {
    const createGroupDiv = document.getElementById('createGroupDiv')
    createGroupDiv.style.display = 'none';
}