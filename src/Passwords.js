let passwords = new Map()

export function setPassword(user, password){
    passwords.set(user, password)
}

export function equals(passwd1, passwd2){
    return passwd1===passwd2
}

export function getPassword(user){
    return passwords.get(user)
}