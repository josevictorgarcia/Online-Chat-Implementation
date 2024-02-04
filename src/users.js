let id = 0;
let users = new Map();

export function addUser(socketID){
    users.set(id, socketID)
    id++;
}

export function getUsers(){
    return [...users.values()]
}

export function getUser(id){
    return users.get(id)
}

export function getID(){
    return id;
}