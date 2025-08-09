import express from 'express';
import { readFile, writeFile } from 'fs/promises';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true    
}))

app.use(express.json());

app.get("/characters", async (req, res) => {
    try{
        const data = await readFile("./characters.json", "utf-8");
        const parsedData = JSON.parse(data);   
        res.status(200).send(parsedData.characters);
    } catch (err) {
        console.error(err);
        res.status(400).send({ error: err.message });
    };
})

app.post("/characters" , async (req, res) => {
    try{
        const added_characters = req.body;
        const data = await readFile("./characters.json", "utf-8");
        const parsedData = JSON.parse(data);
        parsedData.characters.push(added_characters);
        for(let i = 0 ; i < parsedData.characters.length ; i++){
            parsedData.characters[i].id = i + 1;
        }
        await writeFile("./characters.json" , JSON.stringify(parsedData, null, 2) , "utf-8");
        res.status(201).send(parsedData.characters[parsedData.characters.length - 1]);
    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
})

app.get("/characters/:id", async (req, res) => {
    try{
        const requiredId = req.params.id;
        const data = await readFile("./characters.json", "utf-8");
        const parsedData = JSON.parse(data);
        if(requiredId <= parsedData.characters.length){
            for(const character of parsedData.characters) if(character.id == requiredId) res.status(200).send(character)
        } else {
            throw new Error("The character you are trying to get does not exit");
        }
    } catch (err) {
        console.error(err.message);
        res.status(400).send(err.message)
    }
})

app.put("/characters/:id" , async (req, res) => {
    try{
        const requiredId = req.params.id  - 1 ;
        const updated_character = req.body;
        const data = await readFile("./characters.json", "utf-8");
        const parsedData = JSON.parse(data);
        if(requiredId <= parsedData.characters.length && requiredId > 0){
            parsedData.characters[requiredId] = updated_character
            await writeFile("./characters.json" , JSON.stringify(parsedData, null, 2) , "utf-8");
            res.status(201).send(parsedData.characters)
        } else {
            throw new Error("The character you are trying to edit doesn't exist");
        }
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message)
    }
})

app.delete("/characters/:id", async (req, res) => {
    try{
        const requiredId = req.params.id  - 1 ;
        const data = await readFile("./characters.json", "utf-8");
        let parsedData = JSON.parse(data);

        if(requiredId <= parsedData.characters.length && requiredId > 0){
            parsedData.characters.splice(requiredId,1);
            for(let i = 0 ; i < parsedData.characters.length ; i++){
                parsedData.characters[i].id = i + 1;
            }
            await writeFile("./characters.json" , JSON.stringify(parsedData, null, 2) , "utf-8");
            res.send(parsedData.characters)
        } else {
            throw new Error("The character you are trying to delete doesn't even exist")
        }

    } catch(err) {
        console.error(err);        
    }
})

export default app;