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

// const findIndex = (socketVal) => {
//   let returnVal = {index: null};

//   clients.forEach((item, index) => {
//     if (item.id == socketVal) {
//       returnVal = {index, socket: item.socket, coords: {x: item.coords.x, y: item.coords.y}};
//       return returnVal;
//     }
//   });
//   return returnVal;
// }; 



// let clients = [
//   // {id: undefined,
//   // coords: {
//   //   x: 0,
//   //   y: 0
//   // }}
// ];

let clients = {};

io.on('connection', socket => {
  console.log('user connected');
  console.log(socket.id);

  // add client to clients object
  clients[socket.id] = {x:0, y:0};

  socket.emit('send_id_to_client', socket.id);

  console.log(clients)





  socket.on('client_update_coords', coords => {
    clients[socket.id] = {x: coords.x, y: coords.y};
    // console.log(clients)
  });

  socket.on('disconnect', () => {
    delete clients[socket.id]; 
    console.log('client disconnected', socket.id);
    io.emit('client_disconnect', socket.id);
  });
});


function sendCoordsToClients() {
  // console.log(clients);
  // console.log('============================')
  io.volatile.emit('send_coords_to_client', clients);
  // console.log('sending coords')
};

const repeater = setInterval(function() {
  sendCoordsToClients()
}, 15);
