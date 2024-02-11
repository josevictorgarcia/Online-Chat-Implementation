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
    /*if(interests.get(interest) != "true"){
        interests.set(interest, "common")
    }*/
    return interests.get(interest)
}

export function deleteInterest(interest){
    interests.set(interest, "false")
    console.log(interests)
}

/*export function getCommonInterests(interest){
    if(interests.get(interest) === "common"){
        return interests.get(interest)
    }
    return ""
}*/