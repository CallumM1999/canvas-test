const express = require('express');

const app = express();
const hbs = require('express-handlebars');
// const io = require('socket.io')(server);

app.engine('handlebars', hbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Server started on PORT ${port}`));

app.get('/', function(req, res) {
	// res.sendFile('public/index.html', {root: './'});
	res.render('home', {
		port
	});
});

let clients = {};

function addClient(id, username) {
  console.log('adding client')
  clients[id] = {
    username,
    x: 10,
    y: 0,
    x_speed: 0,
    y_speed: 0,
    color: 'red'
  }
  //console.log(clients)
}


io.on('connection', socket => {
  socket.on('new_client_connect', data => {
    addClient(socket.id, data.username);
  });
  
  socket.on('update_player_direction', data => {
    console.log(data)
    clients[socket.id].x_speed = data.x_speed;
    clients[socket.id].y_speed = data.y_speed;
  })

	// socket.emit('send_id_to_client', socket.id);

	// console.log(clients);

	// socket.on('client_update_coords', coords => {
	// 	clients[socket.id] = {
	// 		x: coords.x,
	// 		y: coords.y
	// 	};
	// });

	socket.on('disconnect', () => {
		delete clients[socket.id];
		console.log('client disconnected', socket.id);
		io.emit('client_disconnect', socket.id);
	});
});

function updateUserCoords() {
  for (let key in clients) {
    clients[key].x += clients[key].x_speed;
    clients[key].y += clients[key].y_speed;
  }
}

function sendCoordsToClients() {
  let returnObj = {};
  for(key in clients) {
    returnObj[key] = {
      x: clients[key].x,
      y: clients[key].y,
      color: clients[key].color
    }
  }
  io.volatile.emit('send_coords_to_clients', returnObj);
}

const repeater = setInterval(function() {
  updateUserCoords();
	sendCoordsToClients();
}, 10);