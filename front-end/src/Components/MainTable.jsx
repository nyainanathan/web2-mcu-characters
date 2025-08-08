import axios from 'axios';
import { useEffect, useState } from 'react';

const MainTable = () => {
    
    const [characters, setCharacters] = useState([]);
    const PORT = 3000;
    const baseUrl = "http://127.0.0.1:" + PORT;

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(baseUrl + "/characters");
            setCharacters(response.data);
        };
        fetchData();
    }, []);

    return (
        <table>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Real name</th>
                <th>Universe</th>
            </tr>
            {characters.map((character, index) => (
                <tr key={index}>
                    <th>{character.id}</th>
                    <th>{character.name}</th>
                    <th>{character.realName}</th>
                    <th>{character.universe}</th>
                </tr>
            ))}
        </table>       
    );

}

export default MainTable;