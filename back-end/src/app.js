import express from 'express';
import { readFile, writeFile } from 'fs/promises';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/characters", async (req, res) => {
    const data = await readFile("./src/characters.json", "utf-8");
    const parsedData = JSON.parse(data);   
    res.send(parsedData.characters);
});



export default app;