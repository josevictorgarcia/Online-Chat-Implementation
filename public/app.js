async function newConnection(){
    
    // Listen for the "connect" event
    socket.on('connect', async () => {
        console.log('Connected to the server');
        await fetch(`/addUser?user=${socket.id}`)
        socket.emit('join-room', "global")
    });

    // Listen for the "disconnect" event
    socket.on('disconnect', () => {
        console.log('Disconnected from the server');
    });

    /*socket.on('post-message', async (message, id) => {
        console.log(message)
        
        const response =  await fetch(`/addMessage?message=${message}&user=${id}&socketID=${socket.id}`);
        const newHtml =  await response.text();

        const ventanaNuevoElem = document.getElementById("textWindow");
        ventanaNuevoElem.innerHTML += newHtml;
    })*/

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
    let esperando = "true"

    document.getElementById("buttonConnect2Random").disabled = true
    document.getElementById("buttonSendMessage").disabled = true
    document.getElementById("buttonJoinRoom").disabled = true

    const mensaje = document.getElementById("messageJoinRoom");    

    const interests = document.getElementById("common-interests").value
    console.log(interests)
    //if(interests != ""){
        await fetch(`/setInterests?interests=${interests}`)
        let response = await fetch(`/waitconnection?interests=${interests}`)
        esperando = await response.text()
        console.log(esperando)
        while(esperando === "true"){
            mensaje.innerHTML = "Connecting to random user with common interests...";
            console.log("Hay intereses")
            response = await fetch(`/waitconnection?interests=${interests}`)
            esperando = await response.text()
            console.log(esperando)
            await new Promise(r => setTimeout(r, 2000));
        }
    //}
    
    /*if(interests === ""){
        await fetch(`/setInterests?interests=${interests}`)
        let response = await fetch(`/waitconnection?interests=${interests}`)
        esperando = await response.text()
        while(esperando === "true"){
        
            mensaje.innerHTML = "Connecting to random user...";

            response =  await fetch(`/waitconnection?interests=${interests}`);
            esperando = await response.text()
            console.log(esperando)
            await new Promise(r => setTimeout(r, 2000));
        }
    }*/

    //Clear text window before initiating a new chat
    const ventanaNuevoElem = document.getElementById("textWindow");
    ventanaNuevoElem.innerHTML = "";

    socket.emit('join-random-room')         //Anadir interests

    document.getElementById("buttonConnect2Random").disabled = false
    document.getElementById("buttonSendMessage").disabled = false
    document.getElementById("buttonJoinRoom").disabled = false

    mensaje.innerHTML = "You are now connected to a random user"
}

async function joinRoom(){              //Mismo código que connect2Random pero con algún cambio
    let room = document.getElementById("joinRoom").value
    document.getElementById("joinRoom").value = "";

    socket.emit('join-room', room)
    
    const ventanaNuevoElem = document.getElementById("textWindow");
    ventanaNuevoElem.innerHTML = "";

    let esperando = "true"
    document.getElementById("buttonConnect2Random").disabled = true
    document.getElementById("buttonSendMessage").disabled = true
    document.getElementById("buttonJoinRoom").disabled = true

    const mensaje = document.getElementById("messageJoinRoom");
    while(esperando === "true"){

        mensaje.innerHTML = "Connecting to room " + room;

        const response =  await fetch(`/waitconnection`);
        esperando = await response.text()
        console.log(esperando)
        await new Promise(r => setTimeout(r, 2000));                //Tiempo de espera de 2s antes de iniciar una nueva iteracion
    }
    document.getElementById("buttonConnect2Random").disabled = false
    document.getElementById("buttonSendMessage").disabled = false
    document.getElementById("buttonJoinRoom").disabled = false

    mensaje.innerHTML = "You are now connected to room " + room;
}