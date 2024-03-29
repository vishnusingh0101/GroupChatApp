const host = '3.26.17.155:3000';

async function createUser(e) {
    e.preventDefault();
    const output = document.getElementById('message');
    const h3 = document.createElement('h3');
    try{
        if (document.getElementById('name').value === '' || document.getElementById('mail') === '' || document.getElementById('phone').value === '' || document.getElementById('password').value === '')  {
            h3.innerText = "Please fill all the details";
            output.appendChild(h3);
        } else {
            const obj = {
                name: document.getElementById('name').value,
                mail: document.getElementById('mail').value,
                phone: document.getElementById('phone').value,
                password: document.getElementById('password').value,
            };
            const response = await axios.post(`http://${host}/signup`, obj);
    
            if (response.status === 201 && response.data.message === 'Created new user') {
                localStorage.setItem('token', response.data.token);
                window.location.href = './signin.html';
            } else {
                throw new Error(response.data.message);
            }
    
        }
    }catch(error) {
        console.log(error)
        if(error.response && error.response.status == 409) {
            h3.innerText = error.response.data.message;
        }else {
            h3.innerText = error.message || 'An error occurred Please Try again later';
        }
        output.appendChild(h3);
    }
    setTimeout(() => {
        output.innerHTML = '';
    }, 4000)
}

async function login(e) {
    e.preventDefault();
    const output = document.getElementById('message');
    const h3 = document.createElement('h3');
    try {
        if (document.getElementById('mail').value === '' || document.getElementById('password').value === '') {
            h3.innerText = "Please fill all the details";
            output.appendChild(h3);
        } else {
            const mail = document.getElementById('mail').value;
            const obj = {
                mail,
                password: document.getElementById('password').value,
            };
            const response = await axios.post(`http://${host}/signin`, obj);

            if (response.status === 200 && response.data.message === 'Successfully Logged In') {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('profilemail', mail);
                localStorage.setItem('userId', response.data.userId);
                window.location.href = './groupchat.html';
            } else {
                throw new Error(response.data.message);
            }
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            h3.innerText = error.response.data.message;
        }else if(error.response && error.response.status === 404) {
            h3.innerText = error.response.data.message;
        } else {
            h3.innerText = error.message || 'An error occurred. Please try again later.';
        }
        output.appendChild(h3);
        console.error(error);
    }
    setTimeout(() => {
        output.innerHTML = '';
    }, 4000)
}

