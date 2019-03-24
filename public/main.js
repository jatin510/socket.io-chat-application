const socket = io()


socket.on('chat_received', (data) => {

   console.log('chat recieved')
   refreshList()

})


$(() => {

   refreshList = () => {

      $('#messages').empty()

      $.get('/fetch-message', data => {
         for (let user of data) {
            $('#messages').append(
               $('<li>')
               .append($("<span>")).text(`${user.username} : ${user.message}`)

            )
         }
      })
   }

   $('#messagebox').hide()
   $('#chats').hide()

   $('#login').click(() => {
      socket.emit('login', {
         username: $('#username').val()
      })
   })

   // after logged in show messagebox , fetch messages from db
   // and show the messages

   socket.on('loggedin', () => {
      console.log('Login successful')
      $('#loginform').hide().toggleClass('d-flex')
      $('#messagebox').show()
      $('#chats').show()
      refreshList()
   })


   $('#send').click(() => {
      console.log('sending message')

      socket.emit('chat', {
         message: $('#message').val()
      })

      $.post('/add-message', {
         message: $('#message').val()
      })

      refreshList()

   })



})