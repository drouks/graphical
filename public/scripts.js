var socket = io.connect('http://localhost:3000/'); 
var table = [];

function display()
{
  socket.emit('datarequest');
}

socket.on('updatedata', function(data)
{
    table = JSON.parse(data);
});


