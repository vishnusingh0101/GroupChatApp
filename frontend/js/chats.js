let lastId = localStorage.getItem('lastId');
let groupId = localStorage.getItem('groupId');
const localmessages = localStorage.getItem('localmessages');
const popup = document.getElementById('popup');

window.onload = async () => {
    const usermail = document.getElementById('usermail');
    usermail.innerText = localStorage.getItem('profilemail');
    try {
        const sidebar = document.getElementById('sidebar');
        sidebar.innerHTML = '';
        const token = localStorage.getItem('token');
        const group = await axios.get('http://107.23.1.26:3000/getGroup', { headers: { "Authorization": token } });
        console.log(group.data.data);
        for (const grp of group.data.data) {
            const div = document.createElement('div');
            div.classList = 'Group';
            div.innerText = grp.groupname;
            div.onclick = () => getGroup(grp, div);
            sidebar.appendChild(div);
        }
    } catch (err) {
        console.log(err);
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

}

let optiondiv = document.getElementById('optiondiv');
let options = document.getElementById('options');
let groupmemberlist = document.getElementById('groupmemberlist');
let groupmemberlistoptions = document.getElementById('groupmemberlistoptions');

options.addEventListener('mousedown', function (event) {
    optiondiv.style.display = 'block';
    const val = groupmemberlistoptions.style.display.toString;
    if(val === "block"){
        groupmemberlist.style.display = 'none';
    }

    event.stopPropagation();
});

document.addEventListener('mousedown', function (event) {
    console.log(event.target);
    if (!optiondiv.contains(event.target) && !groupmemberlist.contains(event.target)) {
        optiondiv.style.display = 'none';
        groupmemberlist.style.display = 'none';
        groupmemberlistoptions.style.display = 'none';
    }
});

async function showmemberslist() {
    groupmemberlist.innerHTML = '';
    const groupId = localStorage.getItem('groupId');
    console.log('got hit', groupId);
    const members = await axios.get(`http://107.23.1.26:3000/members?groupId=${groupId}`);
    groupmemberlist.style.display = 'block';
    for (let member of members.data.data) {
        console.log(localStorage.getItem('profileMail'))
        const memb = document.createElement('div');
        memb.classList = 'optionsbutton';
        memb.innerText = member.name;
        console.log(localStorage.getItem('profilemail'), 'profileMail-----------------');
        if(member.mail == localStorage.getItem('profilemail')){
            memb.innerText = member.name+' (You)';
            groupmemberlist.appendChild(memb);
            continue;
        }
        memb.addEventListener('mousedown', function (event) {
            event.preventDefault(); // Prevent default right-click menu

            groupmemberlistoptions.innerHTML = '';
            groupmemberlistoptions.style.display = 'block';

            // Create "Remove" option
            const removeOption = document.createElement('div');
            removeOption.innerText = 'Remove';
            removeOption.classList = 'optionsbutton';
            removeOption.addEventListener('click', function () {
                removeMember(member.id, groupId); // Call the function to remove the member
                groupmemberlistoptions.style.display = 'none'; // Hide the options after clicking
            });
            groupmemberlistoptions.appendChild(removeOption);
            console.log(groupmemberlistoptions);

            // Create "Make Admin" option
            const makeAdminOption = document.createElement('div');
            makeAdminOption.innerText = 'Make Admin';
            makeAdminOption.classList = 'optionsbutton';
            makeAdminOption.addEventListener('click', function () {
                makeAdmin(member.id); // Call the function to make the member an admin
                groupmemberlistoptions.style.display = 'none'; // Hide the options after clicking
            });
            groupmemberlistoptions.appendChild(makeAdminOption);
        });

        groupmemberlist.appendChild(memb);
    }
    console.log(members);
}

function removeMember(memberId) {
    console.log('removeMember');
    const token = localStorage.getItem('token');
    const deleted = axios.get(`http://107.23.1.26:3000/remove?groupId=${groupId}&memberId=${memberId}`, { headers: { "Authorization": token } });
    console.log(deleted);
    groupmemberlistoptions.style.display = 'none';
    groupmemberlist.style.display = 'none';
    groupmemberlistoptions.innerHTML = '';
    // Implement the logic to remove the member with the provided memberId
}

function makeAdmin(memberId) {
    console.log('makeAdmin');
    const token = localStorage.getItem('token');
    const isadmin = axios.get(`http://107.23.1.26:3000/makeadmin?groupId=${groupId}&memberId=${memberId}`, { headers: { "Authorization": token } });
    console.log(isadmin);
    groupmemberlistoptions.style.display = 'none';
    groupmemberlist.style.display = 'none';
    groupmemberlistoptions.innerHTML = '';
    // Implement the logic to make the member with the provided memberId an admin
}





setInterval(async () => {
    let groupId = localStorage.getItem('groupId');
    let lastId = localStorage.getItem('lastId');
    if (groupId) {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://107.23.1.26:3000/msg?groupId=${groupId}&lastId=${lastId}`, { headers: { "Authorization": token } });
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
    const response = await axios.post('http://107.23.1.26:3000/send', obj, { headers: { "Authorization": token } });
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
