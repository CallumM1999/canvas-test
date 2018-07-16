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
	console.log('adding client');
	clients[id] = {
		username,
		x: 0,
			y: 0,
			x_speed: 0,
			y_speed: 0
	};
}

io.on('connection', socket => {
	socket.on('new_client_connect', data => {
		addClient(socket.id, data.username);
	});

	socket.on('update_player_direction', data => {
		clients[socket.id].x_speed = data.x_speed;
		clients[socket.id].y_speed = data.y_speed;
	});

	socket.on('disconnect', () => {
		delete clients[socket.id];
		console.log('client disconnected', socket.id);
		io.emit('client_disconnect', socket.id);
	});
});

function updateUserCoords() {
	for (let key in clients) {
		if (clients.hasOwnProperty(key)) {
			//console.log('keys:' ,key);
			let x = clients[key].x;
			let y = clients[key].y;

			let x_speed = clients[key].x_speed;
			let y_speed = clients[key].y_speed;

			let left_blocked = false;
			let right_blocked = false;
			let up_blocked = false;
			let down_blocked = false;

			for (let player_key in clients) {
				if (player_key !== key) {
					let player_x = clients[player_key].x;
					let player_y = clients[player_key].y;

					// Check X collisions
					if (y >= player_y - 30 && y <= player_y + 30) {
						if (x < player_x && x - player_x > -32) right_blocked = true;
						if ((x > player_x && x - player_x < 32)) left_blocked = true;
					}

					// Check Y collisions
					if (x >= player_x - 30 && x <= player_x + 30) {
						if (y < player_y && y - player_y > -32) down_blocked = true;
						if (y > player_y && y - player_y < 32) up_blocked = true;
					}
				}
			}

			if (!left_blocked && x_speed === -1 && x > 0) clients[key].x -= 1;
			if (!right_blocked && x_speed === 1 && x < 2530) clients[key].x += 1;
			if (!up_blocked && y_speed === -1 && y > 0) clients[key].y -= 1;
			if (!down_blocked && y_speed === 1 && y < 1570) clients[key].y += 1;
		}
	}
	console.log(clients)
}

function sendCoordsToClients() {
	let returnObj = {};
	for (let key in clients) {
		if (clients.hasOwnProperty(key)) {
			returnObj[key] = {
				x: clients[key].x,
				y: clients[key].y,
				color: clients[key].color
			};
		}
	}
	io.volatile.emit('send_coords_to_clients', returnObj);
}

const repeater = setInterval(function() {
	updateUserCoords();
	sendCoordsToClients();
}, 10);