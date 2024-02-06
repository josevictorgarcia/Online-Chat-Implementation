let room = 0;
let count = 0;

export function newRoom(){
    if(count == 0){
        room++
        count++
    }
    else {
        count--
    }
    return room
}

export function getRoom(){
    return room
}
