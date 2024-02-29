export const validateUsername = (username:any): username is string=>{
    return username === "string"
}