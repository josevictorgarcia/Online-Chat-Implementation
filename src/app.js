import express from 'express';
import mustacheExpress from 'mustache-express';
import bodyParser from 'body-parser';
import { __dirname } from './dirname.js';
import userRouter from './userRouter.js';

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
    io.emit("post-message", message, id)
    console.log(message)
  })
});

httpServer.listen(3000, () => console.log('Listening on port 3000!'));

// Fin Socket