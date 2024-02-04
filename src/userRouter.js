import * as users from './users.js'
import express from 'express'
import { io } from 'socket.io-client';
const socket = io("https://localhost:3000");


socket.on("connection", (socket) => {
    console.log(socket.id)
});

socket.on("message", (message) => {
    console.log(message)
})

const router = express.Router()

router.get('/', (req, res) => {
    let id = users.getID();
    res.render('index', {
        id: id
    })
})

router.get('/addMessage', (req, res) => {
    let message = req.query.message
    let id = parseInt(req.query.user)
    let user = "User" + req.query.user
    if(req.query.socketID === users.getUser(id)){
        user = "You"
    }
    res.render('message', {
        message: message,
        user: user
    })
})

router.get('/addUser', (req, res) => {
    let user = req.query.user
    users.addUser(user)
    console.log(users.getUsers())
})
/*
router.get('/addUser', (req, res) => {
    let name = req.query.nombre;

    let nameExists = elementos.existe(name);            //Comprueba si un nombre es valido
    console.log(nameExists);

    if(!nameExists){
        let age = req.query.edad;
        console.log(name);
        console.log(age);
        let newUser = {nombre: name, edad: age};
        elementos.addElem(newUser);

        let elems = elementos.getElems();
        res.render('listOfUsers', {
            users: elems
        })
    }
    else{
        res.render('message', {
            name: name
        })
    }
})*/

export default router