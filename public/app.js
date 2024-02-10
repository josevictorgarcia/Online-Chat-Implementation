async function newConnection(){
    
    // Listen for the "connect" event
    socket.on('connect', async () => {
        console.log('Connected to the server');
        await fetch(`/addUser?user=${socket.id}`)
        socket.emit('join-room', "global")
        socket.interests = []                   //socket.interests se encuentran en el cliente. socket.room en el servidor (se podria cambiar)
        //console.log(socket.interests)
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

    if(!socket.interests.includes(interests)){
        socket.interests.push(interests)
    }
    //console.log("Interest added to the list")

    /*if(socket.interests.length > 1){   //En el caso de que tenga intereses, se le quita el interes nulo ("") y se busca algun usuario que tenga alguno de los mismos intereses
        for (let index = 0; index < socket.interests.length; index++) {
            if (socket.interests[index] === "") {
                socket.interests[index] = null
            }
        }
    }*/
    if(socket.interests.length > 1){
        socket.interests = socket.interests.filter((elem) => elem != "")
    }
    console.log(socket.interests)

    //console.log(interests)
    //if(interests != ""){
        let response = ""
        for(const interest of socket.interests){
            await fetch(`/setInterests?interests=${interest}`)
            /*if(esperando === "true"){
                console.log(interest)
                response = await fetch(`/waitconnection?interests=${interests}`)
                esperando = await response.text()
            }*/
        }
        //esperando = await response.text()
        console.log(esperando)
        while(esperando === "true"){
            mensaje.innerHTML = "Connecting to random user with common interests...";
            console.log("Hay intereses")
            for(const interest of socket.interests){
                if(esperando === "true"){
                    response = await fetch(`/waitconnection?interests=${interest}`)
                    esperando = await response.text()
                }
            }
            console.log(esperando)
            await new Promise(r => setTimeout(r, 100));
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

    for(const interest of socket.interests){
        await fetch(`/deleteInterests?interests=${interest}`)
    }

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

async function addInterestToList(){
    // Get the input field
    let input = document.getElementById("common-interests");

    // Execute a function when the user presses a key on the keyboard
    input.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();

            if(!socket.interests.includes(input.value)){
                socket.interests.push(input.value)
            }
            
            socket.interests = socket.interests.filter((elem) => elem != "")
            console.log(socket.interests)

            console.log("Interest added to the list")

        }
    });
}