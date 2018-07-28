class Player {
	constructor(size, color) {
		this.size = size;
		this.color = color;
	}
	draw() {
		const ctx = game.ctx;

		ctx.fillStyle = this.color;
		ctx.fillRect(
			this.x -game.players[socket.id].x +game.canvas.h_width -(game.players[socket.id].size /2),
			this.y -game.players[socket.id].y +game.canvas.h_height -(game.players[socket.id].size /2),
			this.size,
			this.size
		);
	}
}

class User extends Player {
	constructor(size, color) {
		super(size, color);
	}
	draw() {
		const ctx = game.ctx;
		let start, finish;

		// console.log(this)

		ctx.fillStyle = 'white';
		ctx.fillRect(
			game.canvas.h_width -(this.size /2) -this.x,
			game.canvas.h_height -(this.size /2) -this.y, 
			game.map.width, 
			game.map.height
		);

		ctx.strokeStyle = 'black';

		start = game.canvas.h_width -this.x -(this.size /2);
		finish = game.canvas.h_width +game.map.width -this.x -(this.size /2) +1;
		for (let i = start; i < finish; i += 20) {
			ctx.beginPath();
			ctx.moveTo(i, game.canvas.h_height -this.y -(this.size /2));
			ctx.lineTo(i, game.map.height +game.canvas.h_height -this.y -(this.size /2));
			ctx.stroke();
		}
		
		start = game.canvas.h_height -this.y -(this.size /2);
		finish = game.canvas.h_height +game.map.height -this.y -(this.size /2) +1;
		for (let i = start; i < finish; i += 20) {
			ctx.beginPath();
			ctx.moveTo(game.canvas.h_width -this.x - (this.size /2), i);
			ctx.lineTo(game.map.width +game.canvas.h_width -this.x -(this.size /2), i);
			ctx.stroke(); 
		}

		ctx.fillStyle = this.color;
		ctx.fillRect(
			game.canvas.h_width -(this.size /2), 
			game.canvas.h_height -(this.size /2), 
			this.size, 
			this.size
		);
	}
}

const socket = io.connect('/');

class Game {
	constructor() {
		this.canvas = {
			width: 500,
			height: 500,
			h_width: 250,
			h_height: 250,
			window_resize: window.onresize = () => this.updateCanvasWidth()
		};
		this.map = {
			width: 2000,
			height: 1000
		};
		this.players = {};
		this.user = {
			username: 'Callum',
			x_speed: 0,
			y_speed: 0,
			keyDown: document.onkeydown = e => {
				// up:38 down:40 right:39 left:37
				if (e.keyCode === 38) this.user.y_speed = -1;
				else if (e.keyCode === 40) this.user.y_speed = 1;

				if (e.keyCode === 37) this.user.x_speed = -1;
				else if (e.keyCode === 39) this.user.x_speed = 1;

				this.updatePlayerDirection(this.user.x_speed, this.user.y_speed);
			},
			keyUp: document.onkeyup = e => {
				if (e.keyCode === 38 || e.keyCode === 40) this.user.y_speed = 0;
				if (e.keyCode === 37 || e.keyCode === 39) this.user.x_speed = 0;

				this.updatePlayerDirection(this.user.x_speed, this.user.y_speed);
			}
		};
		this.canvasElement = document.querySelector('canvas#canvas');
		this.ctx = this.canvasElement.getContext('2d'); 
		this.animate_interval = 1000 / 60;
		
	}

	start() {
		console.log('starting game');

		this.updateCanvasWidth();

		setInterval(this.animate, this.animate_interval);
	}
	animate() {
		const _this = game;
		
		_this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);

		if (_this.players.hasOwnProperty(socket.id)) {
			_this.players[socket.id].draw();

			for (let key in _this.players) {
				if (_this.players.hasOwnProperty(key) && key !== socket.id) {
					// console.log(key)
					_this.players[key].draw();					
				}
			}
		} 
		getRate();
	}
	updateCanvasWidth() {
		this.canvasElement.width = window.innerWidth -40;
		this.canvas.width = window.innerWidth -40;
		this.canvas.h_width = (window.innerWidth -40) /2;

		this.canvasElement.height = window.innerHeight -60;
		this.canvas.height = window.innerHeight -60;
		this.canvas.h_height = (window.innerHeight -60) /2;

	}
	updatePlayerDirection(x_speed, y_speed) {
		socket.emit('update_player_direction', {x_speed, y_speed});
	}
	eat() {
		socket.emit('player_eat');
	}
}

const game = new Game();
game.start();

socket.on('connect', () => {
	socket.emit('new_client_connect', {
		username: game.username
	});
});

let fps;
let lastCalledTime;
const fps_counter = document.querySelector('#fps span');  
function getRate() {
	let output, delta;
	if (!lastCalledTime) {
		lastCalledTime = performance.now();
		fps = 0;
		return;
	} 
	fps = (performance.now() - lastCalledTime) / 1000;
	delta = (performance.now() - lastCalledTime) / 1000;
	lastCalledTime = performance.now();
	output = Math.floor(1 / delta);
	
	fps_counter.innerHTML = output;
}

socket.on('send_coords_to_clients', data => {
	// console.log(data)
	for (let key in data) {
		if (key in game.players === false) {
			game.players[key] = data[key];
			if (key === socket.id) {
				game.players[key] = new User(data[key].size, data[key].color);
			} else {
				game.players[key] = new Player(data[key].size, data[key].color);
			}
		} else {
			game.players[key].x = data[key].x;
			game.players[key].y = data[key].y;
			game.players[key].size = data[key].size;
		}
	}

});

socket.on('client_disconnect', id => {
	delete game.players[id];
});