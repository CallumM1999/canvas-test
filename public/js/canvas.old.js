const DOM = {
	canvas: document.querySelector('#canvas'),
	fps_counter: document.querySelector('#fps span'),
	eat_btn: document.querySelector('#eat')
};

let players = {};

let user = {
	direction: {
		x: 0,
		y: 0
	},
	username: 'Callum',
	keyDown: document.onkeydown = e => {
		if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
			if (e.key === 'ArrowUp') user.direction.y = -1;
			if (e.key === 'ArrowDown') user.direction.y = 1;
			if (e.key === 'ArrowLeft') user.direction.x = -1;
			if (e.key === 'ArrowRight') user.direction.x = 1;
			updatePlayerDirection();
		}
	},
	keyUp: document.onkeyup = e => {
		if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
			if (e.key === 'ArrowUp' || e.key === 'ArrowDown') user.direction.y = 0;
			if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') user.direction.x = 0;
			updatePlayerDirection();
		}
	}
};

class Player {
	constructor(size, color) {
		// console.log('size', size)
		this.size = size;
		// this.height = size;
		this.color = color;
	}
	draw() {
		gameEnv.ctx.fillStyle = this.color;
		gameEnv.ctx.fillRect(
			this.x -players[socket.id].x +gameEnv.canvas.h_width -(players[socket.id].size /2),
			this.y -players[socket.id].y +gameEnv.canvas.h_width -(players[socket.id].size /2),
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
		const ctx = gameEnv.ctx;

		ctx.fillStyle = 'white';
		ctx.fillRect(gameEnv.canvas.h_width -(this.size /2) -this.x, gameEnv.canvas.h_height -(this.size /2) -this.y, gameEnv.map.width, gameEnv.map.height);

		ctx.strokeStyle = 'black';
		for (let i = gameEnv.canvas.h_width -this.x -(this.size /2); i < gameEnv.canvas.h_width +gameEnv.map.width -this.x -(this.size /2) +1; i += 20) {
			ctx.beginPath();
			ctx.moveTo(i, gameEnv.canvas.h_width -this.y -(this.size /2));
			ctx.lineTo(i, gameEnv.map.height +gameEnv.canvas.h_width -this.y -(this.size /2));
			ctx.stroke();
		}

		for (let i = gameEnv.canvas.h_height -this.y -(this.size /2); i < gameEnv.canvas.h_height +gameEnv.map.height -this.y -(this.size /2) +1; i += 20) {
			ctx.beginPath();
			ctx.moveTo(gameEnv.canvas.h_height - this.x - (this.size /2), i);
			ctx.lineTo(gameEnv.map.width + gameEnv.canvas.h_width - this.x - (this.size /2), i);
			ctx.stroke();
		}

		ctx.fillStyle = this.color;
		// ctx.fillRect(gameEnv.canvas.h_width - (this.size / 2), gameEnv.canvas.h_height - (this.size / 2), this.size, this.size);
		ctx.fillRect(gameEnv.canvas.h_width -(this.size /2), gameEnv.canvas.h_height -(this.size /2), this.size, this.size);
	}
}

const gameEnv = {
	// canvas: DOM.canvas, 
	canvas: {
		width: 500,
		height: 500,
		h_width: 250,
		h_height: 250
	},
	map: {
		width: 600,
		height: 400
	},
	ctx: DOM.canvas.getContext('2d'),
	// background_url: "https://wallpapertag.com/wallpaper/full/6/0/0/294499-large-pattern-background-2560x1600.jpg",
	animate_interval: 1000 / 75,
	bgImage: new Image(),
	animate: function() {
		const ctx = gameEnv.ctx;

		ctx.clearRect(0, 0, gameEnv.canvas.width, gameEnv.canvas.height);

		// console.log(players)
		if (players.hasOwnProperty(socket.id)) {
			players[socket.id].draw();

			let x = players[socket.id].x;
			let y = players[socket.id].y;
			//const player_width = 30;
			//const player_height = 30;
	
			for (let key in players) {
				if (key !== socket.id) {
					if (players.hasOwnProperty(key)) {
						let player_x = players[key].x;
						let player_y = players[key].y;
		
						// if ((player_x < x + canvas.h_width && player_x > x - canvas.h_width -player.size) && (player_y < y + canvas.h_height && player_y > y - canvas.h_height - player.size)) {
							players[key].draw();
						// }
					}
	
				}
			}
		} else {
			console.log('animate not ready')
		}

		getRate();

	},
	startGame: function() {
		console.log('starting game');

		this.bgImage.src = this.background_url;

		console.log(this.animate_interval);
		setInterval(this.animate, this.animate_interval);
	}
};

gameEnv.startGame();

function eat() {
	socket.emit('player_eat');

}

const socket = io.connect('/');

socket.on('connect', () => {
	socket.emit('new_client_connect', {
		username: user.username
	});
});

let fps;
let lastCalledTime;
function getRate() {
	let output, delta;
	if (!lastCalledTime) {
		lastCalledTime = performance.now();
		fps = 0;
		// return;
	} else {
		fps = (performance.now() - lastCalledTime) / 1000;
		delta = (performance.now() - lastCalledTime) / 1000;
		lastCalledTime = performance.now();
		output = Math.floor(1 / delta);
	}
	// console.log(output + ' seconds')
	DOM.fps_counter.innerHTML = output;
}

socket.on('send_coords_to_clients', data => {
	// getRate();

	for (let key in data) {
		if (key in players === false) {
			players[key] = data[key];
			if (key === socket.id) {
				players[key] = new User(data[key].size, data[key].color);
			} else {
				players[key] = new Player(data[key].size, data[key].color);
			}
		} else {
			players[key].x = data[key].x;
			players[key].y = data[key].y;
			players[key].size = data[key].size;
			// players[key].height = data[key].size;
			
		}
	}

});

socket.on('client_disconnect', id => {
	delete players[id];
});

function updatePlayerDirection() {
	// console.log('update player dir');
	socket.emit('update_player_direction', {
		x_speed: user.direction.x,
		y_speed: user.direction.y
	});
}