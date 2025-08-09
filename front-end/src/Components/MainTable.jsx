import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

const MainTable = () => {
    
    const [characters, setCharacters] = useState([]);
    const PORT = 3000;
    const baseUrl = "http://127.0.0.1:" + PORT;
    
    const [id, setId] = useState("ID");
    const [name, setName] = useState("");
    const [realName, setRealName] = useState("");
    const [universe, setUniverse] = useState("");

    const [editingMode, setEditingMode] = useState(false);
    
    const [deletePrompt, setDeletePrompt] = useState(false)
    const [toDeleteId, setToDeleteId] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
        const response = await fetch(baseUrl + "/characters");
        console.log("response" + response);
        const data = await response.json();
        console.log(data);
        
        setCharacters(data);
    };
        fetchData();
    }, [] );


    const handleEdit = (characterId) => {
        setEditingMode(true);
        
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
        const newEdditCharacter = await fetch(`${baseUrl}/characters/${id}`, {
            method: "PUT",
            headers:{
                "Content-type" : "application/json"
            },
            body: JSON.stringify(editedCharacter)
        } );

        const data = await newEdditCharacter.json();
        
        resetInputs();
        setCharacters([...data]);
        setEditingMode(false);
        console.log(characters);
    }

    const handleNewCharacter = async () => {
        const newCharacter = {id, name, realName, universe};
        const newCharacterAlreadyAdded = await fetch(`${baseUrl}/characters`, {
            method: "POST",
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify(newCharacter)
        });
        const data = await newCharacterAlreadyAdded.json()
        setCharacters([...characters, data]);
        console.log(characters);
        
        resetInputs();
    }

    const handleDelete = async (charId) => {
        const newSetOfCharacters = await fetch(`${baseUrl}/characters/${charId}` ,{
            method: "DELETE"
        });
        const data = await newSetOfCharacters.json();

        setCharacters([...data]);
        console.log(characters);
        setDeletePrompt(false)
        
    }

    return (
        <>
            <h1 className='text-center p-4 text-4xl'>MCU Characters list</h1>

  

            <table className='w-1/2 border-1 m-auto relative'>
                        {
                            deletePrompt && <>
                                <div className=' absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-1 bg-amber-50 p-4 rounded-2xl'>
                                    <p>You do really want to delete this character?</p>
                                    
                                        <button onClick={() => handleDelete(toDeleteId)} className='text-red-400'> &rarr; Yes, delete this character</button>
                                        <br />
                                        <button onClick={() => setDeletePrompt(false)} >&rarr; No, don't delete this character</button>
                                    
                                </div>
                            </>
                        }
            <thead>
                <tr key={"theader"} className='h-12 border-1'>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Real name</th>
                    <th>Universe</th>
                    <th>Actions</th>
                </tr>
                </thead>
   
                <tbody>
                {characters.map((character , index) => (
                    <tr key={index} className='h-12 text-center border-1'>
                        <td className='w-1/5'>{character.id}</td>
                        <td className='w-1/5'>{character.name}</td>
                        <td className='w-1/5'>{character.realName}</td>
                        <td className='w-1/5'>{character.universe}</td>
                        <td className='flex h-full w-full justify-center items-center gap-3'>
                            <button onClick={() => handleEdit(character.id)} className='text-green-600'>Edit</button>
                            <button onClick={() => {setToDeleteId(character.id) ; setDeletePrompt(true)}} className='text-red-600'>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr key={"tfoot"} className='text-center h-12'>
                    <td>
                        {id}
                    </td>
                    <td>
                        <input 
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
                        { editingMode && 
                            <>
                            <button onClick={handleSubmit} className='mr-4'>Confirm</button>
                            <button onClick={ () => {
                                resetInputs();
                                setEditingMode(false);
                            }
                                }>Clear</button>
                            </>
                        }

                        {
                            !editingMode &&
                            <>
                            <button
                            onClick={handleNewCharacter}
                            >Submit</button>
                            </>
                        }
                    </td>
                </tr>
                </tfoot>
            </table>       
        </>
    );

}

export default MainTable;
