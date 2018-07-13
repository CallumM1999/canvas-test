const express = require('express');
const path = require('path');

const app = express();
const hbs = require('express-handlebars');
// const io = require('socket.io')(server);

app.engine('handlebars', hbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Server started on PORT ${port}`));

app.get('/', function (req, res) {
  // res.sendFile('public/index.html', {root: './'});
  res.render('home', {port});
});

const findIndex = (socketVal) => {
  let returnVal = {index: null};

  clients.forEach((item, index) => {
    if (item.id == socketVal) {
      returnVal = {index, socket: item.socket, coords: {x: item.coords.x, y: item.coords.y}};
      return returnVal;
    }
  });
  return returnVal;
}; 



let clients = [
  // {id: undefined,
  // coords: {
  //   x: 0,
  //   y: 0
  // }}
];

io.on('connection', socket => {
  console.log('user connected');
  console.log(socket.id);

  clients.push({id: socket.id, coords: {x:0, y:0}});
  // console.log('clients', clients);
  socket.emit('send_id_to_client', socket.id);

  function sendCoordsToClients() {
    console.log(clients);
    console.log('============================')
    socket.emit('send_coords_to_client', clients);
    // console.log('sending coords')
  };

  const repeater = setInterval(() => sendCoordsToClients(), 1);




  socket.on('send_coords_to_server', coords => {
    
    index = findIndex(socket.id);
    if (index.index !== null) {
      clients[index.index].coords.x = coords.x;
      clients[index.index].coords.y = coords.y;
    } else {
      console.log('error, index is null')
    }
    // console.log(clients)
    // console.log('=============')
  });


  socket.on('disconnect', () => {
    index = findIndex(socket.id);
    clients.splice(index.index, 1);

    console.log('client disconnected', socket.id);
    // console.log('clients', clients);
  });
});


