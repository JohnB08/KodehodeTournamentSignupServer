import express from "express"
import cors from "cors"
import { postNewUser, fetchAllBrackets, checkExistingName } from "../pgFunctions/postUsers.js";
import { initializeServer } from "../pgFunctions/initializeServer.js";
import { validateUsername } from "../typeValidatingUserName/typeValidatingUserName.js";
import { checkUsername } from "../typeValidatingUserName/sanitizeUsername.js";

const server = express();
const port = 3000

server.use(express.json())
server.use(cors())

const initialization = await initializeServer()
console.log(initialization)


server.post("/newUser", async(req, res)=>{
    const {username} = req.body
    if (checkUsername(username)){
        return res.status(403).json({message: "Please pick a username without profanity"})
    }
    const existingUsername = await checkExistingName(username)
    if (existingUsername.success && existingUsername.data?.rowCount !== 0){
        return res.status(400).json({message: "Username taken"})
    }
    const newUserAdded = await postNewUser(username)
    if (!newUserAdded?.success){
        console.log(newUserAdded?.error)
        return res.status(500).json({message: "Internal server error", error: newUserAdded?.error})
    }
    return res.status(200).json({status: 200, message: "User Added Successfully!"})
})

server.get("/fetchBrackets", async (req, res)=>{
    const fetchedBrackets = await fetchAllBrackets();
    if (!fetchedBrackets.success){
        console.log(fetchedBrackets.error)
        return res.status(500).json({message: "Internal Server Error", error: fetchedBrackets.error})
    }
    return res.status(200).json({message: "Fetched Brackets: ", data: fetchedBrackets.data})
})


server.listen(port, ()=>{
    console.log(`Server listening on ${port}`)
})