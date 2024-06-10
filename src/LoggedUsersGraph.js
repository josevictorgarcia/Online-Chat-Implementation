import * as Passwords from './Passwords.js'

let graph = new Map()

function notBelongs(user, graph){
    return !graph.has(user)
}

export function access(user, contrasena){
    //console.log(graph)
    return graph.has(user) && Passwords.equals(contrasena, Passwords.getPassword(user))
}

export function addUser(usuario, contrasena){
    console.log(graph)
    if (notBelongs(usuario, graph)){                       //Si el usuario no pertenece ya al grafo, le anadimos
        graph.set(usuario, [])
        Passwords.setPassword(usuario, contrasena)
        return "set"
    }
    /*else{                                                  //Pertenezca o no al sistema, iniciamos sesion si la contrasena es correcta
        if(Passwords.equals(contrasena, Passwords.getPassword(usuario))){
            return "true"
        }
    }*/
    return "false"                                             
}

export function addAdjacentUser(usuario, adjacent){
    if (graph.get(usuario).indexOf(adjacent)==-1){
        graph.get(usuario).push(adjacent)
    }
}

export function getUser(usuario){
    return graph.get(usuario)
}