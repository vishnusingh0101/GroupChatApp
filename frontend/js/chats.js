async function send(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const chatInput = document.getElementById('chat-input').value;
    const obj = {chatInput};
    const response = axios.post('http://localhost:3000/send', obj, {headers: {"Authorization": token}})
    if(response.status == true) {
        setMessageInBox(response.data);
    }
    console.log(response);
}