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

const canvas_width = 2000;
const canvas_height = 1000;
const client_start_size = 15;
// const user_width = 30;
// const user_height = 30;

function generateNewCoords() {
	let x = Math.floor(Math.random() * (canvas_width - client_start_size));
	let y = Math.floor(Math.random() * (canvas_height - client_start_size));
	return {x, y};
}

function tryNewCoords(coords) {
	const x = coords.x;
	const y = coords.y;

	for (let key in clients) {
		if (clients.hasOwnProperty(key)) {
			let client_x = clients[key].x;
			let client_y = clients[key].y;
			let client_size = clients[key].size;

			// +5 spacing 
			if ((client_x > x -client_size - 5 && client_x < x +client_size + 5) && (client_y > y -client_size - 5 && client_y < y +client_size + 5)) {
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
		y_speed: 0,
		size: client_start_size,
		color: 'red'
	};
}


io.on('connection', socket => {
	socket.on('new_client_connect', data => {
		addClient(socket.id, data.username);
	});

	socket.on('update_player_direction', data => {
		// console.log(data)
		clients[socket.id].x_speed = data.x_speed;
		clients[socket.id].y_speed = data.y_speed;
	});

	socket.on('player_eat', () => {
		console.log('player ate');
		clients[socket.id].size += 2;
		clients[socket.id].x -= 1;
		clients[socket.id].y -= 1;
		// console.log(clients[socket.id])
	});

	socket.on('disconnect', () => {
		delete clients[socket.id];
		console.log('client disconnected', socket.id);
		io.emit('client_disconnect', socket.id);
	});
});



let lastCalledTime, fps;
function getRate() {
	let time, delta, output;
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
	// console.log(output + ' seconds');
}

function updateUserCoords() {
	let x, y, x_speed, y_speed, left_blocked, right_blocked, up_blocked, down_blocked, player_x, player_y;

	for (let key in clients) {
		if (clients.hasOwnProperty(key)) {

			
			({x,y} = clients[key]);
			({x_speed,y_speed} = clients[key]);
			size = clients[key].size;

			left_blocked = right_blocked = up_blocked = down_blocked = false;

			for (let player_key in clients) {
				if (player_key !== key) {

					player_x = clients[player_key].x;
					player_y = clients[player_key].y;
					let player_size = clients[player_key].size;

					if ((player_x > x -player_size && player_x < x +size) && (player_y > y -player_size && player_y < y +size)) {

						if (x < player_x && (y > player_y -size +1 && y < player_y +player_size -1))       right_blocked = true;
						if (x > player_x && (y > player_y -size +1 && y < player_y +player_size -1)) left_blocked = true;
						if (y < player_y && (x > player_x -size +1 && x < player_x +player_size -1))        down_blocked = true;
						if (y > player_y && (x > player_x -size +1 && x < player_x +player_size -1))   up_blocked = true;
						

						// console.log(`left:${left_blocked} right:${right_blocked} up:${up_blocked} down:${down_blocked}`);
					} 
				}
			}

			// width/height - 30px
			// 600 x 400 (add 1 for grid)
			// change ammount must be +-1 or there will be calculation errors
			if (!left_blocked && x_speed === -1 && x > 0) clients[key].x -= 1;
			else if (!right_blocked && x_speed === 1 && x < canvas_width - size -1) clients[key].x += 1;
			if (!up_blocked && y_speed === -1 && y > 0) clients[key].y -= 1;
			else if (!down_blocked && y_speed === 1 && y < canvas_height - size -1) clients[key].y += 1;
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
				color: clients[key].color,
				size: clients[key].size
			};

		}
	}
	// console.log(returnObj)
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