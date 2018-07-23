const express = require('express');

const app = express();

app.use(express.static('public'));

const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Server started on PORT ${port}`));

app.get('/', function(req, res) {

});

let clients = {};

const width = 600;
const height = 400;
const player_width = 30;
const player_height = 30;

function generateNewCoords() {
	let x = Math.floor(Math.random() * (600 - 30));
	let y = Math.floor(Math.random() * (400 - 30));
	return {
		x, y
	};
}

function tryNewCoords(coords) {
	const x = coords.x;
	const y = coords.y;

	for (let key in clients) {
		if (clients.hasOwnProperty(key)) {
			let client_x = clients[key].x;
			let client_y = clients[key].y;

			// +5 spacing 
			if ((client_x > x - 30 - 5 && client_x < x + 30 + 5) && (client_y > y - 30 - 5 && client_y < y + 30 + 5)) {
				return true;
			}
		}
	}
	return false;
}

function addClient(id, username) {
	let coords = {};
	let blocked;

	console.log('adding client');

	coords = generateNewCoords();
	blocked = tryNewCoords(coords);

	while (blocked) {
		coords = generateNewCoords();
		blocked = tryNewCoords(coords);
	}

	clients[id] = {
		username,
		x: coords.x,
			y: coords.y,
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


function getRate() {
	let time, fps, delta, output, lastCalledTime;
	time = process.hrtime()[0] * 1000 + process.hrtime()[1] / 1000000;
	if (!lastCalledTime) {
		lastCalledTime = time;
		fps = 0;
		return;
	}
	fps = (time - lastCalledTime) / 1000;
	delta = (time - lastCalledTime) / 1000;
	lastCalledTime = time;
	output = Math.floor(1 / delta);

	console.log(output + ' seconds');
}

function updateUserCoords() {
	let x, y, x_speed, y_speed, left_blocked, right_blocked, up_blocked, down_blocked, player_x, player_y;

	for (let key in clients) {
		if (clients.hasOwnProperty(key)) {

			({
				x,
				y
			} = clients[key]);
			({
				x_speed,
				y_speed
			} = clients[key]);

			left_blocked = right_blocked = up_blocked = down_blocked = false;

			for (let player_key in clients) {
				if (player_key !== key) {

					player_x = clients[player_key].x;
					player_y = clients[player_key].y;

					if ((player_x > x - player_width && player_x < x + player_width) && (player_y > y - player_height && player_y < y + player_height)) {
						if (x < player_x && (y > player_y - player_width + 1 && y < player_y + player_width - 1)) right_blocked = true;
						if (x > player_x && (y > player_y - player_width + 1 && y < player_y + player_width - 1)) left_blocked = true;
						if (y < player_y && (x > player_x - player_height + 1 && x < player_x + player_height - 1)) down_blocked = true;
						if (y > player_y && (x > player_x - player_height + 1 && x < player_x + player_height - 1)) up_blocked = true;
						// console.log(`left:${left_blocked} right:${right_blocked} up:${up_blocked} down:${down_blocked}`);
					}
				}
			}

			// width/height - 30px
			// 600 x 400 (add 1 for grid)
			// change ammount must be +-1 or there will be calculation errors
			if (!left_blocked && x_speed === -1 && x > 0) clients[key].x -= 1;
			else if (!right_blocked && x_speed === 1 && x < width - player_width - 1) clients[key].x += 1;
			if (!up_blocked && y_speed === -1 && y > 0) clients[key].y -= 1;
			else if (!down_blocked && y_speed === 1 && y < height - player_height - 1) clients[key].y += 1;
		}
	}
	getRate();
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

setInterval(function() {
	updateUserCoords();
	// sendCoordsToClients();
}, 1000 / 120);

setInterval(function() {
	// updateUserCoords();
	sendCoordsToClients();
}, 1000 / 60);