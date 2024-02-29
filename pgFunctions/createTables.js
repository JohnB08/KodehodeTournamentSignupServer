import { db } from "../pgSettings/pgSettings.js";
export const createUsersTable = async () => {
    try {
        const data = await db.query(`CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE
);`);
        return { success: true, data };
    }
    catch (error) {
        return { success: false, error };
    }
};
export const createBracketsTable = async () => {
    try {
        const data = await db.query(`
CREATE TABLE Brackets (
    bracket_id SERIAL PRIMARY KEY,
    bracket_name VARCHAR(255),
    user_count INTEGER DEFAULT 0
);`);
        return { success: true, data };
    }
    catch (error) {
        return { success: false, error };
    }
};
export const createRelationshipTable = async () => {
    try {
        const data = await db.query(`CREATE TABLE Bracket_User_Relationship (
    bracket_id INTEGER REFERENCES Brackets(bracket_id),
    user_id INTEGER REFERENCES Users(user_id),
    PRIMARY KEY (bracket_id, user_id)
);`);
        return { success: true, data };
    }
    catch (error) {
        return { success: false, error };
    }
};
