import express from 'express';
import { readFile, writeFile } from 'fs/promises';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/characters", async (req, res) => {
    try{
        const data = await readFile("./characters.json", "utf-8");
        const parsedData = JSON.parse(data);   
        res.status(200).send(parsedData.characters);
    } catch (err) {
        console.error(err);
    }
});

app.post("/characters" , async (req, res) => {
    try{
        const added_characters = req.body;
        const data = await readFile("./characters.json", "utf-8");
        const parsedData = JSON.parse(data);
        parsedData.characters.push(added_characters);
        await writeFile("./characters.json" , JSON.stringify(parsedData, null, 2) , "utf-8");
        res.status(201).send("Character added successfully!!")
    } catch (err) {
        console.error(err);
    }
})

export default app;