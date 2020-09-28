const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const app = express();
const router = require('./router');
const { Socket } = require('dgram');
const cors = require('cors');

const {getUser, getUsersInRoom, removeUser, addUser} = require('./users.js');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = socketio(server);                 //Creating an instance of socket.io

app.use(router);
app.use(cors());

io.on('connection', (socket)=>{

    socket.on('join', ({name, room}, callback)=>{
        const {error, user} = addUser({id:socket.id, name, room});  
        if(error){
            return callback(error);
        }
        socket.join(user.room); //connects user to the room
        io.to(user.room).emit('roomData', {room:user.room, users:getUsersInRoom(user.room)});        //n
        socket.emit('message', {user:`Admin`, text:`${user.name}, welcome to the room - ${user.room}`});   //message given to the user which has joined 
        socket.broadcast.to(user.room).emit('message', {user:'Admin', text:`${user.name} has joined !!!`});  //this message will be broadcasted to all other users but the user that has just joined
        
        callback();
    });

    socket.on('sendMessage', (message, callback)=>{
        const user = getUser(socket.id);
        io.to(user.room).emit('message', {user:user.name, text:message});
        callback();
    });

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message', {user:'Admin', text:`${user.name} has left the chat room`});
            io.to(user.room).emit('roomData', {room:user.room, users:getUsersInRoom(user.room)});             //n
        }
    });
});

server.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
});