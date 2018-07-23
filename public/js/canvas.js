const DOM = {
	canvas: document.querySelector('#canvas'),
	fps_counter: document.querySelector('#fps span')
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
	constructor() {
		this.width = 30;
		this.height = 30;
		this.color = 'black';
	}
	draw() {
		gameEnv.ctx.fillStyle = this.color;
		gameEnv.ctx.fillRect(
			this.x - players[socket.id].x + gameEnv.canvas.h_width - 15,
			this.y - players[socket.id].y + gameEnv.canvas.h_width - 15,
			this.width,
			this.height
		);
	}
}

class User extends Player {
	constructor() {
		super();
		this.color = 'red';
	}
	draw() {
		// console.log(gameEnv)
		const ctx = gameEnv.ctx;

		ctx.fillStyle = 'white';
		ctx.fillRect(-this.x + gameEnv.canvas.h_width - 15, -this.y + gameEnv.canvas.h_height - 15, gameEnv.map.width, gameEnv.map.height);

		ctx.strokeStyle = 'black';
		for (let i = gameEnv.canvas.h_width - this.x - 15; i < gameEnv.canvas.h_width + gameEnv.map.width + 1 - this.x; i += 20) {
			ctx.beginPath();
			ctx.moveTo(i, gameEnv.canvas.h_width - this.y - 15);
			ctx.lineTo(i, gameEnv.map.height + gameEnv.canvas.h_width - this.y - 15);
			ctx.stroke();
		}

		for (let i = gameEnv.canvas.h_height - this.y - 15; i < gameEnv.canvas.h_width + gameEnv.map.height + 1 - this.y; i += 20) {
			ctx.beginPath();
			ctx.moveTo(gameEnv.canvas.h_height - this.x - 15, i);
			ctx.lineTo(gameEnv.map.width + gameEnv.canvas.h_width - this.x - 15, i);
			ctx.stroke();
		}

		ctx.fillStyle = 'red';
		ctx.fillRect(gameEnv.canvas.h_width - (this.width / 2), gameEnv.canvas.h_height - (this.height / 2), this.width, this.height);
	}
}

const gameEnv = {
	// canvas: DOM.canvas, 
	canvas: {
		width: 500,
		height: 500,
		h_width: 150,
		h_height: 150
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
		if (players.hasOwnProperty(socket.id)) players[socket.id].draw();
		let x = players[socket.id].x;
		let y = players[socket.id].y;
		//const player_width = 30;
		//const player_height = 30;

		for (let key in players) {
			if (key !== socket.id) {
				let player_x = players[key].x;
				let player_y = players[key].y;

				if ((player_x < x + 150 && player_x > x - 180) && (player_y < y + 150 && player_y > y - 180)) {
					players[key].draw();
				}
			}
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

const socket = io.connect('/');

socket.on('connect', () => {
	socket.emit('new_client_connect', {
		username: user.username
	});
});

function getRate() {
	let fps, lastCalledTime, output, delta;
	if (!lastCalledTime) {
		lastCalledTime = performance.now();
		fps = 0;
		return;
	}
	fps = (performance.now() - lastCalledTime) / 1000;
	delta = (performance.now() - lastCalledTime) / 1000;
	lastCalledTime = performance.now();
	output = Math.floor(1 / delta);

	// console.log(output + ' seconds')
	DOM.fps_counter.innerHTML = output;
}

socket.on('send_coords_to_clients', data => {



	// getRate();

	for (let key in data) {
		if (key in players === false) {
			players[key] = data[key];
			if (key === socket.id) {
				players[key] = new User();
			} else {
				players[key] = new Player();
			}
		} else {
			players[key].x = data[key].x;
			players[key].y = data[key].y;
			players[key].color = data[key].color;
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