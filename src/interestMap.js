let interests = new Map()

export function setInterest(interest){
    if (interests.get(interest) != "true"){
        interests.set(interest, "true")
    }
    else{
        interests.set(interest, "false")
    }
}

export function waiting(interest){
    return interests.get(interest)
}

export function deleteInterest(interest){
    interests.set(interest, "false")
    console.log(interests)
}