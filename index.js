import express, { json } from "express"
import mysql from "mysql2/promise"
import { configDB } from "./configDB.js";
import cors from "cors"

let connection;

try {
    connection = await mysql.createConnection(configDB)
} catch(error) {
    console.log(error);
}

const app = express()
app.use(express.json())
app.use(cors())

app.get("/todos", async (req, res)=>{
    try{
        const sql = "SELECT * FROM todos ORDER BY TIMESTAMP desc;"
        const [rows, fields] = await connection.execute(sql)
        return res.send(rows)
    } catch (error) {
        console.log(error);
    }
})

app.post("/todos", async (req, res)=>{
    const {task} = req.body;
    if(!task) return res.status(400).json({msg:"missing details"})
    try{
        const sql = "INSERT INTO todos (task) VALUES(?)"
        const values = [task]
        const [rows, fields] = await connection.execute(sql, values)
        return res.status(200).json({msg:"success"})
    } catch (error) {
        return res.status(500).json({msg:"server r"})
    }
})

app.delete("/todos/:id", async (req, res)=>{
    const {id} = req.params;
    try{
        const sql = "DELETE FROM todos WHERE id=?"
        const values = [id]
        const [rows, fields] = await connection.execute(sql, values)
        return res.status(200).json({msg:"success delete"})
    } catch (error) {
        return res.status(500).json({msg:"server r"})
    }
})

app.put("/todos/completed/:id", async (req, res)=>{
    const {id} = req.params;
    try{
        const sql = "update todos SET completed = NOT completed WHERE id=?"
        const values = [id]
        const [rows, fields] = await connection.execute(sql, values)
        return res.status(200).json({msg:"success update completed"})
    } catch (error) {
        return res.status(500).json({msg:"server r"})
    }
})

app.put("/todos/task/:id", async (req, res)=>{
    const {task} = req.body
    const {id} = req.params;
    try{
        const sql = "update todos SET task=? WHERE id=?"
        const values = [task, id]
        const [rows, fields] = await connection.execute(sql, values)
        return res.status(200).json({msg:"success update task"})
    } catch (error) {
        return res.status(500).json({msg:"server r"})
    }
})

app.listen(3000, ()=>{console.log("start on 3000")})