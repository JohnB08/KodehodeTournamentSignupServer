import {en, no} from "naughty-words"

const allBadWords = en.concat(no)

export const checkUsername = (username: string) =>{
    let isUsernameBad = false
    const normalizedUsername = username.toLowerCase()
    allBadWords.forEach((badWord: string)=>{
        if (normalizedUsername.includes(badWord)){
            isUsernameBad = true
        }
    })
    return isUsernameBad
}