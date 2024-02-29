import pkg from "pg";
const {Pool} = pkg


export const db = new Pool({
    user: "John",
    password: "ein2tre4",
    host: "postGres",
    database: "bracketsDB",
    port: 5432,
})