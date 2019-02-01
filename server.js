const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const app = express();
var points = [];


app.use(express.static('public'));

app.get('/', function(req, res) {
   res.sendFile('/public/index.html');
});


var server = app.listen(3000, function() {
    console.log('listening on *:3000');
 });

 var io = socket(server);

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   console.log('A user connected');

    socket.on('newpoint', function(data)
    {
    points.push(data);
    console.log(data);
    socket.emit('updatepoints',points);
    });

   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });


});


