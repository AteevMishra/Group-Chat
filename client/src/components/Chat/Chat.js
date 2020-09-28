import React, {useState, useEffect} from 'react';
import queryString from 'query-string';  //this will help us in retrieving data from URL
import io from 'socket.io-client';
import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

let socket;

const Chat = ({location})=>{              //'location' prop comes from react-router

    const [name , setName] = useState('');
    const [room , setRoom] = useState('');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState(''); 
    const [users, setUsers] = useState([]);

    const ENDPOINT = 'localhost:5000';

    useEffect(()=>{
        const {name, room} = queryString.parse(location.search);   //we extract the parameters from the URL using 'location.search' ; queryString will convert the parameters into an object
        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);
        socket.emit('join', {name, room}, (error)=>{   //Remember that the 3rd argument(arrow function) will only be executed when callback function is called on the server end
            if(error)
                alert(error);
        });
        return()=>{              //For disconnect event to occur
            socket.emit('disconnect');
            socket.off();
            //socket.disconnect();
        }

    }, [ENDPOINT, location.search]);  //if any of these 2 values change then our useEffect will rerender, otherwise it will not be rendered

    useEffect(()=>{             //For handling messages
        socket.on('message', (message)=>{
            setMessages([...messages, message]);
            socket.off();
        })

        socket.on('roomData', ({users})=>{
            setUsers(users);
        })
    }, [messages])     //only rendered when messages array changes
    

    //function for sending messages

    const sendMessage = (e)=>{

        e.preventDefault();  //To prevent browser refresh after hitting a key
        if(message){
            socket.emit('sendMessage', message, ()=> setMessage('') );   //after sending the message the callback function clears the input field
        }
    }

    return(
        <div className = 'outerContainer'>
            <div className = 'container'>
                <InfoBar room ={room}/>
                <Messages messages = {messages} name = {name}/>
                <Input message = {message} setMessage = {setMessage} sendMessage = {sendMessage}/>
            </div>
            <TextContainer users = {users}/>
        </div>
    )
}

export default Chat;