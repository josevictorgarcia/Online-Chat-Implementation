import * as Passwords from './Passwords.js'

let graph = new Map()

function notBelongs(user, graph){
    return !graph.has(user)
}

export function addUser(usuario, contrasena){
    if (notBelongs(usuario, graph)){                       //Si el usuario no pertenece ya al grafo, le anadimos
        graph.set(usuario, [])
        Passwords.setPassword(usuario, contrasena)
    }
    else{                                                  //Pertenezca o no al sistema, iniciamos sesion si la contrasena es correcta
        if(Passwords.equals(contrasena, Passwords.getPassword(usuario))){
            return "true"
        }
    }    
    return "false"                                             
}

export function getUser(usuario){
    return graph.get(usuario)
}