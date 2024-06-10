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
    socket.on('disconnect', async () => {
        console.log('Disconnected from the server');
        /*for(const interest of socket.interests){
            await fetch(`/deleteInterests?interests=${interest}`)
        }
        socket.emit('join-random-room')*/
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

async function connectRandomStranger(id){
    // Conseguir la pagina html e imprimirla por pantalla mientras se conecta

    const interests = document.getElementById("common-interests")
    console.log(socket.interests)
    if(interests == null && !socket.interests.some((elem) => elem === "")){
        console.log(socket.interests)
        socket.interests.push("")}
    else if(interests != null && socket.interests.indexOf(interests)==-1){
        socket.interests = socket.interests.filter((elem) => elem != interests.value)
        socket.interests.push(interests.value)
    }

    const paginaPrincipal = await fetch(`/get2RandomPage?id=${id}`);
    const nuevoHtml = await paginaPrincipal.text();

    const ventanaACambiar = document.getElementById("main");
    ventanaACambiar.innerHTML = nuevoHtml
    // Fin conseguir e imprimir la pagina html

    document.getElementById("buttonSendMessage").disabled = true
    document.getElementById("buttonSkip").disabled = true
    document.getElementById("common-interests").disabled = true

    await connect2Random()

    document.getElementById("buttonSendMessage").disabled = false
    document.getElementById("buttonSkip").disabled = false
    document.getElementById("common-interests").disabled = false
}

async function connectToRooms(id){
    // Conseguir la pagina html e imprimirla por pantalla mientras se conecta
    const paginaPrincipal = await fetch(`/getRoomPage?id=${id}`);
    const nuevoHtml = await paginaPrincipal.text();

    const ventanaACambiar = document.getElementById("main");
    ventanaACambiar.innerHTML = nuevoHtml
    // Fin conseguir e imprimir la pagina html

    await joinRoom()

}

async function connect2Random(){

    console.log(socket.interests)
    console.log("Joining new room...")
    let esperando = "true"

    const mensaje = document.getElementById("messageJoinRoom");    

    //document.getElementById("buttonConnect2Random").disabled = true
    
    //document.getElementById("buttonJoinRoom").disabled = true

    //console.log("Interest added to the list")

    /*if(socket.interests.length > 1){   //En el caso de que tenga intereses, se le quita el interes nulo ("") y se busca algun usuario que tenga alguno de los mismos intereses
        for (let index = 0; index < socket.interests.length; index++) {
            if (socket.interests[index] === "") {
                socket.interests[index] = null
            }
        }
    }*/
    //if(socket.interests.length > 0){
    socket.interests = socket.interests.filter((elem) => elem != "")
    if (socket.interests.length == 0) {socket.interests.push("")}
    
    //}

    console.log(socket.interests)

    //console.log(interests)
    //if(interests != ""){
        let response = ""
        for(const interest of socket.interests){
            await fetch(`/setInterests?interests=${interest}`)        //Semaforo??
            /*if(esperando === "true"){
                console.log(interest)
                response = await fetch(`/waitconnection?interests=${interests}`)
                esperando = await response.text()
            }*/
        }
        //esperando = await response.text()
        //console.log(esperando)
        mensaje.innerHTML = "Connecting to random user with common interests...";
        while(esperando === "true"){
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

        for(const interest of socket.interests){
            await fetch(`/deleteInterests?interests=${interest}`)
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

    socket.emit('join-random-room')         //Anadir interests

    let commonInterests = []
    ////////////////////////
    /*
    for(const interest of socket.interests){
        response = await fetch(`/getCommonInterests?interests=${interest}`)
        let newInterest = await response.text()
        commonInterests.push(newInterest)
    }*/

    socket.emit('exchange-interests', socket.interests)
    socket.on('receive-interests', (common_interests) => {
        commonInterests = common_interests
        //socket.emit('exchange-interests', socket.interests)
    });
    await new Promise(r => setTimeout(r, 2000));            //Es necesario poner un tiempo de espera para que el servidor pueda ser usado por el segundo socket
    socket.emit('exchange-interests', socket.interests)
    //socket.emit('exchange-interests', socket.interests)
    //socket.interests = socket.interests.filter((elem) => elem != "")
    commonInterests = commonInterests.filter((elem) => socket.interests.includes(elem))
    console.log(commonInterests)

    //Clear text window before initiating a new chat
    const ventanaNuevoElem = document.getElementById("textWindow");
    ventanaNuevoElem.innerHTML = "";

    //document.getElementById("buttonConnect2Random").disabled = false                          //No quitar
    //document.getElementById("buttonJoinRoom").disabled = false                                //No quitar

    /*if(socket.interests[0] != "" && commonInterests.length === 0){  //Si entramos aqui es que ha ocurrido un error y se ha salido del while sin haber encontrado otro socket con intereses comunes
        socket.emit('join-random-room')                             //Sumamos +1 a las random rooms para compensar que ya habiamos entrado en una
        for(const interest of socket.interests){
            await fetch(`/deleteInterests?interests=${interest}`)   //Reseteamos todos los intereses a false en el mapa
        }
        await connect2Random()
        return 0;
    }*/

    if (commonInterests.length == 0){
        socket.emit('increase-room')        //join-random-room. Replantear esto. Se produce un fallo en cadena que afecta a todos los clientes
        //await connect2Random()            //Llamar recursivamente es una movida heavy. No hacerlo.
        mensaje.innerHTML = "Could not find a match :(" //Lanzar excepcion??
    }
    else if(commonInterests.some((elem) => elem === "")){
        mensaje.innerHTML = "You are now connected to a random user"
    } else {
        stringToPrint = ""
        commonInterests.forEach(elem => stringToPrint += elem + " ")
        mensaje.innerHTML = "You both like " + stringToPrint
    }
}

async function joinRoom(){              //Mismo código que connect2Random pero con algún cambio
    let room = document.getElementById("joinRoom").value
    document.getElementById("joinRoom").value = "";

    if(room == ""){
        room = "global"
    }
    socket.emit('join-room', room)
    
    const ventanaNuevoElem = document.getElementById("textWindow");
    ventanaNuevoElem.innerHTML = "";

    let esperando = "true"
    //document.getElementById("buttonConnect2Random").disabled = true
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
    //document.getElementById("buttonConnect2Random").disabled = false
    document.getElementById("buttonSendMessage").disabled = false
    document.getElementById("buttonJoinRoom").disabled = false

    mensaje.innerHTML = "You are now connected to room " + room;
}

async function addInterestToList(event){
/*    // Get the input field
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
    });*/
    let input = document.getElementById("common-interests");

    if(event.key === "Enter"){
        if(!socket.interests.includes(input.value)){
            socket.interests.push(input.value)
        }
        
        socket.interests = socket.interests.filter((elem) => elem != "")
        console.log(socket.interests)

        console.log("Interest added to the list")
    }
}

async function getLoginPage(option){
    //console.log(option)
    const paginaPrincipal = await fetch(`/getLoginPage?option=${option}`);
    const nuevoHtml = await paginaPrincipal.text();

    const ventanaACambiar = document.getElementById("main");
    ventanaACambiar.innerHTML = nuevoHtml
}

async function login(){
    usuario = document.getElementById("usuario").value
    contrasena = document.getElementById("contrasena").value
    
    //const response = await fetch(`/addUserGraph?usuario=${usuario}&contrasena=${contrasena}`)
    const response = await fetch(`/login?usuario=${usuario}&contrasena=${contrasena}`)
    const existe = await response.text()
    console.log(existe)
    if (existe === "true") {
        document.getElementById("message").innerHTML = "Access granted"
        
        const paginaUsuario = await fetch(`/getUsuario?usuario=${usuario}`)
        const nuevoHtml = await paginaUsuario.text()

        const ventanaACambiar = document.getElementById("main")
        ventanaACambiar.innerHTML = nuevoHtml
    }
    else {
        document.getElementById("message").innerHTML = "Incorrect username or password"
    }
    /*else if (existe === "false"){
        document.getElementById("message").innerHTML = "Incorrect username or password"
    }*/
    /*else{
        document.getElementById("message").innerHTML = "Your account doesn't exist. We created a new one with the username and password that you provided. Now you can access"
    }*/
}

async function signUp(){
    usuario = document.getElementById("usuario").value
    contrasena = document.getElementById("contrasena").value

    const response = await fetch(`/register?usuario=${usuario}&contrasena=${contrasena}`)
    const existe = await response.text()
    if (existe === "set") {
        document.getElementById("message").innerHTML = "Registration completed successfully. Now you can login."
    }
    else {
        document.getElementById("message").innerHTML = "User already registered"
    }
}