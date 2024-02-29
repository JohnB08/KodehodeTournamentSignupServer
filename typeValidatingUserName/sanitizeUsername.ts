import {en, no} from "naughty-words"

const allBadWords = en.concat(no)

export const checkUsername = (username: string) =>{
    let isUsernameBad = false
    allBadWords.forEach((badWord: string)=>{
        if (username.includes(badWord)){
            isUsernameBad = true
        }
    })
    return isUsernameBad
}