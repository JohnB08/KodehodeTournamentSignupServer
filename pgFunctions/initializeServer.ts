import { createUsersTable, createBracketsTable, createRelationshipTable } from "../pgFunctions/createTables.js";

export const initializeServer = async()=>{
    const createBrackets = await createBracketsTable()
    const createUsers = await createUsersTable()
    const createRelTable = await createRelationshipTable()
    return [createBrackets, createUsers, createRelTable]
}