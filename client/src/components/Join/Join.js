import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import './Join.css';

const Join = ()=>{

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    return(
        <div className = 'joinOuterContainer'>
            <div className = 'joinInnerContainer'>
                <h1 className = 'heading'>Join</h1>
                <div><input type = 'text' placeholder = 'Name' className = 'joinInput' onChange = {e => setName(e.target.value)}/></div>
                <br></br>
                <div><input type = 'text' placeholder = 'Room' className = 'joinInput_mt-20' onChange={e => setRoom(e.target.value)}/></div>
                <br></br>
                <Link onClick = {e => (!name || !room)?e.target.preventDefault() : null }to = {`/chat?name=${name}&room=${room}`} >
                    <button type = 'submit' className = 'button_mt-20'>Sign In</button>
                </Link>
            </div>
        </div>
    )
}

export default Join;