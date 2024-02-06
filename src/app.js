import express from 'express';
import mustacheExpress from 'mustache-express';
import bodyParser from 'body-parser';
import { __dirname } from './dirname.js';
import userRouter from './userRouter.js';
import * as roomGen from './roomGen.js'

import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

app.set('views', __dirname + '/../views');
app.set('view engine', 'html');
app.engine('html', mustacheExpress(), ".html");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/../public'));

app.use('/', userRouter);

// Socket

const httpServer = createServer(app);
const io = new Server(httpServer, {
  // ...
});

// Socket.IO connection event
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });

  socket.on("send-message", (message, id) => {
    console.log("Socket id: ", socket.id)
    console.log("Socket room: ", socket.room)
    //console.log("Global room: ", socket.rooms)
    //console.log("Global room: ", socket.rooms)
    //if(socket.room === undefined){
      //io.sockets.emit("post-message", message, id)
    //if(socket.room === "global") {console.log("emmiting in global")
    //  io.sockets.in("global").emit("post-message-room", message, id)
    //} else{
      io.sockets.in(socket.room).emit("post-message-room", message, id)             //////////////////////
    //}
    console.log(message)
  })

  socket.on("join-room", () => {
    if(socket.room === undefined){
      socket.room = "global"
      socket.join("global")
    }
    else{
      let room = roomGen.newRoom()
      socket.leave(socket.room)
      socket.room = room.toString()
      socket.join(room.toString())          //Importante, debe usarse toString porque no es lo mismo una habitacion dada por un numero entero que por un numero expresado como un string
      //console.log(room)
    }
  })
});

httpServer.listen(3000, () => console.log('Listening on port 3000!'));

// Fin Socket