const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const {
   Messages,
   db
} = require('./database/db')

const app = express()
const server = http.Server(app)
const io = socketio(server)

let idUserMap = {}
var message
var user

app.use(express.json());
app.use(
   express.urlencoded({
      extended: true
   })
);

app.use('/', express.static(__dirname + '/public'))

io.on('connection', (socket) => {
   console.log(`Connected with id ${socket.id}`)

   //login 
   socket.on('login', (data) => {
      idUserMap[socket.id] = data.username
      console.log(`Login request from ${idUserMap[socket.id]}`)
      socket.emit('loggedin')
   })

   // message
   socket.on('chat', (data) => {

      user = idUserMap[socket.id]
      message = data.message

      io.emit('chat_received', {
         username: idUserMap[socket.id],
         message: data.message
      })

   })

})


app.get('/fetch-message', async (req, res) => {
   console.log('message fetching')

   let data = await Messages.findAll()

   res.send(data)

})


app.post('/add-message', async (req, res) => {
   console.log(user)
   let newMessage = await Messages.create({
      username: user,
      message: message
   })

   res.send(newMessage)
})


db.sync()
   .then(() => {
      server.listen(5555, () => {
         console.log('connected with port 5555')
      })
   })