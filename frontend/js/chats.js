let lastId = localStorage.getItem('lastId');
let groupId = localStorage.getItem('groupId');
const token = localStorage.getItem('token');
const optionDiv = document.getElementById('optiondiv');
const options = document.getElementById('options');
const groupMemberList = document.getElementById('groupmemberlist');
const groupMemberListOptions = document.getElementById('groupmemberlistoptions');

const socket = io('http://localhost:3000');


window.onload = async () => {
    const usermail = document.getElementById('usermail');
    usermail.innerText = localStorage.getItem('profilemail');
    try {
        const sidebar = document.getElementById('sidebar');
        sidebar.innerHTML = '';
        const group = await axios.get('http://localhost:3000/getGroup', { headers: { "Authorization": token } });
        for (const grp of group.data.data) {
            showGroup(grp);
        }
    } catch (err) {
    }
};

function getGroup(grp, div) {
    const chatbox = document.getElementById('chatbox');
    chatbox.style.display = 'block';

    const groupElements = sidebar.getElementsByClassName('Group');
    for (groupEl of groupElements) {
        groupEl.classList.remove('active');
    }
    div.classList.add('active');
    localStorage.setItem('groupId', grp.id);
    document.getElementById('messagebox').innerHTML = '';
    let lastId = null;
    localStorage.setItem('lastId', lastId);
    localStorage.setItem('localmessages', '');

    //head grpname
    const grpname = document.getElementById('grpname');
    grpname.innerHTML = '';
    const h3 = document.createElement('h3');
    h3.innerText = grp.groupname;
    grpname.appendChild(h3);

    //option button
    if (grp.createBy === localStorage.getItem('profilemail')) {
        const previousdelbtn = document.getElementById('deletegroup');
        if (previousdelbtn) {
            optionDiv.removeChild(previousdelbtn);
        }
        const deletegroupbtn = document.createElement('button');
        deletegroupbtn.innerText = 'DeleteGroup';
        deletegroupbtn.id = 'deletegroup';
        deletegroupbtn.addEventListener('mousedown', async (event) => {
            event.preventDefault();
            const obj = {
                mail: localStorage.getItem('profilemail')
            }
            const deletebool = await axios.post(`http://localhost:3000/deletegroup?groupname=${grp.groupname}`, obj, { headers: { "Authorization": token } });
            
            if (deletebool) {
                socket.emit('deletegroup', grp.groupname);
            }
        })
        optionDiv.appendChild(deletegroupbtn);
    }
    loadGroupMessage(grp.id);
    console.log(grp);
    localStorage.setItem('groupname', grp.groupname);
    socket.emit('ingroup', grp.groupname);
}

options.addEventListener('mousedown', (event) => {
    optionDiv.style.display = 'flex';
    event.stopPropagation();
});

document.addEventListener('mousedown', (event) => {
    if (!optionDiv.contains(event.target) && !groupMemberList.contains(event.target)) {
        optionDiv.style.display = 'none';
        groupMemberList.style.display = 'none';
        groupMemberListOptions.style.display = 'none';

    }
});

async function showMembersList() {
    groupMemberList.innerHTML = '';
    const groupId = localStorage.getItem('groupId');
    const profileMail = localStorage.getItem('profilemail');

    try {
        const response = await axios.get(`http://localhost:3000/members?groupId=${groupId}`);
        const members = response.data.data;

        groupMemberList.style.display = 'block';
        groupMemberListOptions.style.display = 'none';

        members.forEach(member => {
            const memberDiv = document.createElement('div');
            memberDiv.classList.add('optionsbutton');
            memberDiv.innerText = member.name;
            if (member.mail === profileMail) {
                memberDiv.innerText += '(You)';
                memberDiv.addEventListener('mousedown', (event) => {
                    event.preventDefault();
                    groupMemberListOptions.style.display = 'none';
                });
            } else {
                memberDiv.addEventListener('mousedown', (event) => {
                    event.preventDefault();
                    groupMemberListOptions.innerHTML = '';
                    groupMemberListOptions.style.display = 'block';

                    const leftPosition = event.clientX + window.scrollX - 120;
                    const topPosition = event.clientY + window.scrollY - 75;
                    groupMemberListOptions.style.left = leftPosition + "px";
                    groupMemberListOptions.style.top = topPosition + "px";

                    const removeOption = createOption('Remove', () => {
                        removeMember(member.id, groupId);
                        socket.emit('removeuser', member.name);
                        groupMemberListOptions.style.display = 'none';
                    });
                    groupMemberListOptions.appendChild(removeOption);

                    const makeAdminOption = createOption('Make Admin', () => {
                        makeAdmin(member.id);
                        socket.emit('newAdmin', member.name);
                        groupMemberListOptions.style.display = 'none';
                    });
                    groupMemberListOptions.appendChild(makeAdminOption);
                });
            }
            groupMemberList.appendChild(memberDiv);
        });
    } catch (error) {
        console.error('Error retrieving members:', error);
    }
}

function createOption(text, onClick) {
    const option = document.createElement('div');
    option.innerText = text;
    option.classList.add('optionsbutton');
    option.addEventListener('click', onClick);
    return option;
}


function showGroup(grp, socketbool) {
    const div = document.createElement('div');
    div.classList = 'Group';
    div.innerText = grp.groupname;
    div.id = grp.groupname;
    div.onclick = () => getGroup(grp, div);
    sidebar.appendChild(div);
    if (socketbool) {
        div.click();
    }
}


function removeMember(memberId) {
    console.log('removeMember');
    const token = localStorage.getItem('token');
    const deleted = axios.get(`http://localhost:3000/remove?groupId=${groupId}&memberId=${memberId}`, { headers: { "Authorization": token } });
    console.log(deleted);
    groupmemberlistoptions.style.display = 'none';
    groupmemberlist.style.display = 'none';
    groupmemberlistoptions.innerHTML = '';
    // Implement the logic to remove the member with the provided memberId
}

function makeAdmin(memberId) {
    console.log('makeAdmin');
    const token = localStorage.getItem('token');
    const isadmin = axios.get(`http://localhost:3000/makeadmin?groupId=${groupId}&memberId=${memberId}`, { headers: { "Authorization": token } });
    console.log(isadmin);
    groupmemberlistoptions.style.display = 'none';
    groupmemberlist.style.display = 'none';
    groupmemberlistoptions.innerHTML = '';
    // Implement the logic to make the member with the provided memberId an admin
}

async function loadGroupMessage(groupId) {
    const localmessages = localStorage.getItem('localmessages' + groupId);
    let lastId = 1;
    if (groupId) {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/msg?groupId=${groupId}&lastId=${lastId}`, { headers: { "Authorization": token } });
        console.log(response);
        const messagebox = document.getElementById('messagebox');
        if (localmessages === null) {
            response.data.message = response.data.message.slice(-10);
        }
        if (response.data.status === true) {
            let data;
            for (const message of response.data.message) {
                if (!isMessageExists(message.id)) {
                    setMessageInBox(message);
                    lastId = message.id;
                    data += message;
                }
            }
            localStorage.setItem('lastId', lastId);

            const previousLocalMessages = localStorage.getItem(localmessages);
            const arrayString = previousLocalMessages + JSON.stringify(data);
            localStorage.setItem('localmessages' + groupId, arrayString);

            messagebox.scrollTop = messagebox.scrollHeight;
        }
    }
}

const textarea = document.getElementById("chat-input");

textarea.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        send();
    }
});

async function send() {
    const token = localStorage.getItem('token');
    const chatInput = document.getElementById('chat-input').value;
    const obj = {
        chatInput,
        groupId: localStorage.getItem('groupId')
    };
    const response = await axios.post('http://localhost:3000/send', obj, { headers: { "Authorization": token } });
    console.log(localStorage.getItem('groupname'));
    if (response.data.status === true) {
        lastId = lastId + 1;
        socket.emit('sendmessage', response.data.message, localStorage.getItem('groupname'));
        document.getElementById('chat-input').value = '';
    } else {
        console.log('error in 250');
    }
}

const multimediaButton = document.getElementById("multimedia");
const fileInput = document.getElementById("myFileInput");

multimediaButton.addEventListener("click", function () {
    fileInput.click();
});

fileInput.addEventListener('change', async (event) => {
    const selectedFiles = event.target.files;

    // Loop through all selected files
    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(`http://localhost:3000/sendFile?groupId=${localStorage.getItem('groupId')}`, formData, {
                headers: {
                    'Authorization': token,
                    // 'Content-Type': 'multipart/form-data',
                }
            });
            
            socket.emit('sendmessage', response.data.message, localStorage.getItem('groupname'));
            console.log('Upload successful!');
        } catch (error) {
            console.error('Upload failed:', error.message);
        }
    }
});



function setMessageInBox(obj) {
    console.log('obj ---------'+obj);
    const messagebox = document.getElementById('messagebox');
    if (document.getElementsByClassName('msg').length > 9) {
        messagebox.removeChild(document.getElementsByClassName('msg')[0]);
    }
    const id = localStorage.getItem('userId');

    const name = document.createElement('div');
    name.classList = 'name';

    const message = document.createElement('div');

    const messagecontent = document.createElement('div');

    if (obj.userId == id) {
        console.log(obj.userId);
        console.log(id);
        name.innerText = 'You:';
        message.classList = 'messageright msg';
    } else {
        name.innerText = obj.name;
        message.classList = 'messageleft msg';
    }
    if (obj.link == true) {
        messagecontent.classList = 'filecontent';
        const downloadLink = document.createElement("a");
        downloadLink.style.display = 'none';
        downloadLink.href = obj.URL;
        downloadLink.download = obj.message;
        messagecontent.addEventListener('mousedown', ()=>{
            downloadLink.click();
        });
        messagecontent.innerHTML = '<img src="../images/icons/file.png"><i class="fi fi-rr-down-to-line"></i>'+ obj.message;
    } else {
        messagecontent.classList = 'messagecontent';
        messagecontent.innerText = obj.message;
    }

    message.appendChild(name);
    message.appendChild(messagecontent);

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


//groups creation





let userMails = new Set();

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
    socket.emit('showNewGroup', group);
    const list = document.getElementById('memberlist');
    list.innerHTML = '';
    moveback();


}

function moveback() {
    const createGroupDiv = document.getElementById('createGroupDiv')
    createGroupDiv.style.display = 'none';
}

function removeGroupfromScreen(groupname) {
    const sidebar = document.getElementById('sidebar');
    const group = document.getElementById(groupname);

    if (group) {
        sidebar.removeChild(group);
    }

    const chatbox = document.getElementById('chatbox');
    chatbox.style.display = 'none';
}


//All sockets
socket.on('displaysuccess', response => {
    showGroup(response.data.group, true);
});

socket.on('deletesuccess', response => {
    removeGroupfromScreen(response);
});

socket.on('groupmsg', data => {
    console.log(data);
    setMessageInBox(data);
});

socket.on('removeusersuccess', name => {
    console.log(name, ' removed from the group');
});

socket.on('newAminsuccess', name => {
    console.log(name, ' become admin');
});