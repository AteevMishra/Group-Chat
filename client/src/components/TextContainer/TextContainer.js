import React from 'react';
import onlineIcon from '../../icons/onlineIcon.png';
import './TextContainer.css'

const TextContainer = ({users}) =>{
    return(
        <div className = 'textContainer'>
            {
                users?
                (
                    <div>
                        <h1>People in the room:</h1>
                        <div className = 'activeContainer'>
                            <h3>
                                {users.map( ({name})=>(
                                    <div key = {name} className = 'activeItem'>
                                        {name}
                                        <img src = {onlineIcon} alt = 'Active'/>
                                    </div>
                                ))}
                            </h3>
                        </div>
                    </div>
                )
                :null
            }
        </div>
    );
};

export default TextContainer;