const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const app = express();
const mongoose = require('mongoose');



const mongoURL = 'mongodb://drouks2:calendardb651258@ds125693.mlab.com:25693/numbers2display';
mongoose.connect(mongoURL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var dataSchema = mongoose.Schema({
  date: String,
  float: Number 
});

var Random = mongoose.model('random', dataSchema,'random');

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

    socket.on('datarequest', function()
    {
    console.log('datarequest');
    Random.find()
    .lean()
    .exec()
    .then(docs=>
      {
         console.log(JSON.stringify(docs));
         socket.emit('updatedata',JSON.stringify(docs));
      })
    .catch(err=>{
      console.log(err);
      response.send(err);
     }); 
    });

   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });


});


