import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

const MainTable = () => {
    
    const [characters, setCharacters] = useState([]);
    const PORT = 3000;
    const baseUrl = "http://127.0.0.1:" + PORT;
    const [operations, setOperations] = useState(0);

    const [id, setId] = useState("ID");
    const [name, setName] = useState("");
    const [realName, setRealName] = useState("");
    const [universe, setUniverse] = useState("");

    const nameRef = useRef(null);
    const realNameRef = useRef(null);
    const universeRef = useRef(null);

    const fetchData = async () => {
        const response = await axios.get(baseUrl + "/characters");
        setCharacters(response.data);
    };

    useEffect(() => {
        fetchData();
    }, [operations] );


    const handleEdit = (characterId) => {
        let thischaracter ;

        for(const character of characters) {
            if(character.id == characterId) {
                thischaracter = character;
                break;
            }
        }

        setId(thischaracter.id);
        setName(thischaracter.name);
        setRealName(thischaracter.realName);
        setUniverse(thischaracter.universe);       
    }

    const resetInputs = () => {
        setId("ID") ;
        setName("");
        setRealName("");
        setUniverse("");
    }

    const handleSubmit = async () => {
        const editedCharacter = { id, name, realName, universe };
        console.log(editedCharacter);
       
        await fetch(`${baseUrl}/characters/${id}`, {
            method: "PUT",
            headers:{
                "Content-type" : "application/json"
            },
            body: JSON.stringify(editedCharacter)
        } );

        resetInputs();

        setOperations(r => r+1)
        
    }

    return (
        <>
            <h1 className='text-center p-4 text-4xl'>MCU Characters list</h1>

            <table className='w-1/2 border-1 m-auto'>
                <tr className='h-12 border-1'>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Real name</th>
                    <th>Universe</th>
                    <th>Actions</th>
                </tr>
                {characters.map((character) => (
                    <tr key={character.id} className='h-12 text-center border-1'>
                        <td className='w-1/5'>{character.id}</td>
                        <td className='w-1/5'>{character.name}</td>
                        <td className='w-1/5'>{character.realName}</td>
                        <td className='w-1/5'>{character.universe}</td>
                        <td className='flex h-full w-full justify-center items-center gap-3'>
                            <button onClick={() => handleEdit(character.id)} className='text-green-600'>Edit</button>
                            <button className='text-red-600'>Delete</button>
                        </td>
                    </tr>
                ))}
                <tr className='text-center h-12'>
                    <td>
                        {id}
                    </td>
                    <td>
                        <input 
                        ref={nameRef}
                        className='text-center outline-0' 
                        type="text" 
                        name="name" 
                        id="name"
                        placeholder='Name...' 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        />
                    </td>
                    <td>
                        <input 
                        ref={realNameRef}
                        className='text-center outline-0' 
                        type="text" 
                        name="realName" 
                        id="realName" 
                        placeholder='Real Name...'
                        value={realName}
                        onChange={(e) => setRealName(e.target.value)}
                        required
                        />
                    </td>
                    <td>
                        <input 
                        ref={universeRef}
                        className='text-center outline-0' 
                        type="text" name='universe' 
                        id='universe' 
                        placeholder='Universe ...'
                        value={universe}
                        onChange={(e) => setUniverse(e.target.value)}
                        required
                        />
                    </td>
                    <td> 
                        <button onClick={handleSubmit} className='mr-4'>Confirm</button>
                        <button onClick={resetInputs}>Clear</button>
                    </td>
                </tr>
            </table>       
        </>
    );

}

export default MainTable;
