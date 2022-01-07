var connected = false;

var socket = io("http://localhost:3001");

function sendMessage() {
    (async () => {
        let message = document.getElementById('input').value;
        const rawResponse = await fetch('http://localhost:3001/api/messages/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: message
            })
        });
        //console.log(message);
        socket.emit('chatMessage', message);
        document.getElementById('input').value = '';
        const response = rawResponse;
        console.log(response);
        document.getElementById('list').scrollTop = 20000;
    })
    ();
}