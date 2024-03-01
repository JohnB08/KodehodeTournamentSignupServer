import { db } from "../pgSettings/pgSettings.js";
import {v4 as uuid} from "uuid"

const fetchUnfilledBracket = async() =>{
    try{
        const data = await db.query(`
            SELECT bracket_id, user_count
            FROM Brackets
            WHERE user_count < 5
            ORDER BY user_count ASC
            LIMIT 1;`
        )
        return {success: true, data}
    } catch(error){
        return {success: false, error}
    }
}

const postNewUserInNewBracket = async (username: string)=>{
    const uniqueId = uuid()
    const bracketName = `MKBRACKET_${uniqueId}`
        try{
            const data = await db.query(`
                INSERT INTO Users (username)
                VALUES ('${username}')
                RETURNING user_id;
                `)
            const userID = data.rows[0].user_id
            const brackets = await db.query(`
                INSERT INTO Brackets (bracket_name, user_count)
                VALUES ('${bracketName}', 1)
                RETURNING bracket_id;
                `
                );
            const bracketId = brackets.rows[0].bracket_id
            console.log(bracketId)
            const instertRel = await db.query(`
                INSERT INTO Bracket_User_Relationship (bracket_id, user_id)
                VALUES (${bracketId}, ${userID});`
                );
            const updateBrackets = await db.query(`      
                UPDATE Brackets
                SET user_count = user_count + 1
                WHERE bracket_id = ${bracketId};
            `)
            return {success:true, data, instertRel, brackets, updateBrackets}
        } catch (error){
            return {success: false, error}
        }
}


const postNewUserInCurrentBracket = async (username: string, bracket_id: number) =>{
            try{
            const data = await db.query(`
            INSERT INTO Users (username)
            VALUES ('${username}');
            INSERT INTO Bracket_User_Relationship (bracket_id, user_id)
            VALUES (${bracket_id}, (SELECT user_id FROM Users WHERE username = '${username}'));
            UPDATE Brackets
            SET user_count = user_count + 1
            WHERE bracket_id = ${bracket_id};`
            );
            return {success: true, data}
        }catch (error){
            return {success: false, error}
        }
    }



export const postNewUser = async (username: string) =>{

    const bracketWithRoom = await fetchUnfilledBracket();
    console.log(bracketWithRoom)
    if (bracketWithRoom.data?.rowCount === 0){
        const data = await postNewUserInNewBracket(username)
        if (!data.success){
            return {success: false, error: data.error}
         } 
         return {success: true, data: data.data}
     }
    if (bracketWithRoom.data?.rowCount !== 0){
         console.log("Rows: ", bracketWithRoom.data?.rows)
        const data = await postNewUserInCurrentBracket(username, bracketWithRoom.data?.rows[0].bracket_id)
         if (!data.success){
             return {success: false, error: data.error}
         }
         return {success: true, data: data.data}
  
}

}

export const fetchAllBrackets = async () =>{
    try{
        const data = await db.query(`
         SELECT 
                b.bracket_id,
                b.bracket_name,
                ARRAY_AGG(u.username) AS usernames
            FROM 
                Brackets b
            JOIN 
                Bracket_User_Relationship bur ON b.bracket_id = bur.bracket_id
            JOIN 
                Users u ON bur.user_id = u.user_id
            WHERE
                u.is_deleted = FALSE
            GROUP BY 
                b.bracket_id, b.bracket_name;
        `)
        return {success: true, data}
    } catch (error){
        return {success: false, error}
    }
}

export const checkExistingName = async (username: string) =>{
    try{
        const data = await db.query(`SELECT * FROM Users WHERE username = '${username}'`)
        return {success: true, data}
    } catch (error){
        return {success: false, error}
    }
}