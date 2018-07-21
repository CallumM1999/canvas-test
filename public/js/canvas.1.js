const DOM = {
	canvas: document.querySelector('#canvas'),
	fps_counter: document.querySelector('#fps span')
};

let players = {};

let user = {
	direction: {x: 0, y: 0},
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
		gameEnv.ctx.fillRect(this.x - players[socket.id].x + 150,
			this.y - players[socket.id].y + 150,
			this.width, this.height);
	}
}

class User extends Player {
	constructor() {
		super();
		this.color = 'red';
	}
	draw() {
		// console.log(gameEnv)
		let ctx = gameEnv.ctx;

		// gameEnv.ctx.drawImage(gameEnv.bgImage, -this.x + 150, -this.y + 150);


		ctx.fillStyle = 'white';

		ctx.fillRect(-this.x +150, -this.y +150, 600, 400);

		ctx.strokeStyle = 'black';
		// console.log(this.x)

		for (let i = -this.x + 150; i < 180 + (571 - this.x) ; i += 20) {
			ctx.beginPath();
			ctx.moveTo(i, 150 - this.y);
			ctx.lineTo(i, 400 - this.y + 150);
			ctx.stroke();
		  }
		  
		  for (let i = -this.y + 150; i < 180 + (371 - this.y); i += 20) {
			ctx.beginPath();
			ctx.moveTo(150 - this.x, i);
			ctx.lineTo(600 - this.x + 150, i);
			ctx.stroke();
		  }

		ctx.fillStyle = 'red';

		ctx.fillRect(150, 150, this.width, this.height);
	}
}

const gameEnv = {
	// canvas: DOM.canvas, 
	width: 300,
	height: 300,
	h_width: 150,
	h_height: 150,
	ctx: DOM.canvas.getContext('2d'),
	background_url: "https://wallpapertag.com/wallpaper/full/6/0/0/294499-large-pattern-background-2560x1600.jpg",
	animate_interval: 1000 / 75,
	bgImage: new Image(),
	animate: function() {
		const ctx = gameEnv.ctx;

		ctx.clearRect(0, 0, 300, 300);

		players[socket.id].draw();

		for (let key in players) {
			if (key !== socket.id) {
				players[key].draw();
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

var lastCalledTime;
var fps;

function getRate() {
	if (!lastCalledTime) {
		lastCalledTime = performance.now();
		fps - 0;
		return;
	}
	fps = (performance.now() - lastCalledTime) / 1000;
	delta = (performance.now() - lastCalledTime)/1000;
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