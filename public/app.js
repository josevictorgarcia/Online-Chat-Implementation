async function newConnection(){
    
    // Listen for the "connect" event
    socket.on('connect', async () => {
        console.log('Connected to the server');
        await fetch(`/addUser?user=${socket.id}`)
        socket.emit('join-room')
    });

    // Listen for the "disconnect" event
    socket.on('disconnect', () => {
        console.log('Disconnected from the server');
    });

    socket.on('post-message', async (message, id) => {
        console.log(message)
        
        const response =  await fetch(`/addMessage?message=${message}&user=${id}&socketID=${socket.id}`);
        const newHtml =  await response.text();

        const ventanaNuevoElem = document.getElementById("textWindow");
        ventanaNuevoElem.innerHTML += newHtml;
    })

    //////////////////////
    socket.on('post-message-room', async (message, id) => {
        console.log("Emitting message")
        console.log(message)
        
        const response =  await fetch(`/addMessage?message=${message}&user=${id}&socketID=${socket.id}`);
        const newHtml =  await response.text();

        const ventanaNuevoElem = document.getElementById("textWindow");
        ventanaNuevoElem.innerHTML += newHtml;
    })
    //////////////////////

}

async function sendMessage(id){
    //const socket = io();
    let message = document.getElementById("message").value
    document.getElementById("message").value = "";
    socket.emit('send-message', message, id)

    /*socket.on('post-message', async (message, id) => {
        console.log(message)
        console.log("Error!")
        
        const response =  await fetch(`/addMessage?message=${message}&user=${id}&socketID=${socket.id}`);
        const newHtml =  await response.text();

        const ventanaNuevoElem = document.getElementById("textWindow");
        ventanaNuevoElem.innerHTML += newHtml;
    })*/
}

async function connect2Random(){
    console.log("Joining new room...")
    socket.emit('join-room')
    
    //Clear text window before initiating a new chat
    const ventanaNuevoElem = document.getElementById("textWindow");
    ventanaNuevoElem.innerHTML = "";
}