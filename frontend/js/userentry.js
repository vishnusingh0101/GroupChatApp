async function createUser(e) {
    e.preventDefault();
    const output = document.getElementById('message');
    const h3 = document.createElement('h3');
    if ((document.getElementById('name').value || document.getElementById('mail').value || document.getElementById('phone').value || document.getElementById('password').value) == '') {
        h3.innerText = "Please fill all the details";
        output.appendChild(h3);
    } else {
        const obj = {
            name: document.getElementById('name').value,
            mail: document.getElementById('mail').value,
            phone: document.getElementById('phone').value,
            password: document.getElementById('password').value,
        };
        const user = await axios.post('http://localhost:3000/signup', obj);
        if (user.data.message == "Created new user") {
            window.location.href = "../html/mainpage.html"
        } else {
            h3.innerText = user.data.message;
            output.appendChild(h3);
        }
    }
    setTimeout(() => {
        output.innerHTML = '';
    }, 4000)
}

async function login(e) {
    e.preventDefault();
    const output = document.getElementById('message');
    const h3 = document.createElement('h3');
    if ((document.getElementById('mail').value || document.getElementById('password').value) == '') {
        h3.innerText = "Please fill all the details";
        output.appendChild(h3);
    } else {
        const obj = {
            mail: document.getElementById('mail').value,
            password: document.getElementById('password').value,
        };
        console.log(obj);
        const user = await axios.post('http://localhost:3000/signin', obj);
        if (user.data.message == "Log in Success") {
            localStorage.setItem('token', user.data.token);
            window.location.href = "../html/mainpage.html"
        } else {
            h3.innerText = user.data.message;
            output.appendChild(h3);
        }
    }
    setTimeout(() => {
        output.innerHTML = '';
    }, 4000)
}
