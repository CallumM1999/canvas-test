


const $DOM = {
	canvas: $('canvas'),
	document: $(document)
};

const gameEnv = {
	canvas: $DOM.canvas,
	ctx: this.canvas.getContext('2d'),
	background_url: "https://wallpapertag.com/wallpaper/full/6/0/0/294499-large-pattern-background-2560x1600.jpg",
	players: {},
	animate_interval: 1000 / 1,
	animate: function() {
		console.log('animation');
	},
	startGame: function() {
		console.log(this.animate_interval)
		setInterval(this.animate, this.animate_interval);
	}
};

gameEnv.startGame();

const socket = io.connect('/');

let y_speed = 0;
let x_speed = 0;

socket.on('connect', () => {
	socket.emit('new_client_connect', {
		username: 'user1'
	});
});


socket.on('send_coords_to_clients', data => {
	//console.log(data)
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
	//console.log(players)
});


socket.on('client_disconnect', id => {
	delete players[id];
});

socket.on('collision', data => {
	alert('collision');
});

function updatePlayerDirection() {
	socket.emit('update_player_direction', {
		x_speed, y_speed
	});
}

$(document).keydown(e => {
	if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
		if (e.key === 'ArrowUp') y_speed = -1;
		if (e.key === 'ArrowDown') y_speed = 1;
		if (e.key === 'ArrowLeft') x_speed = -1;
		if (e.key === 'ArrowRight') x_speed = 1;

		updatePlayerDirection();
	}
});

$(document).keyup(e => {
	if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
		if (e.key === 'ArrowUp' || e.key === 'ArrowDown') y_speed = 0;
		if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') x_speed = 0;


	}

});

// let bgImage = new Image();
// bgImage.src = gameEnv.background_url;




// class Player {
// 	constructor() {
// 		this.width = 30;
// 		this.height = 30;
// 		this.color = 'black';
// 	}
// 	draw() {
// 		ctx.fillStyle = this.color;
// 		ctx.fillRect(this.x - players[socket.id].x + 150,
// 			this.y - players[socket.id].y + 150,
// 			this.width, this.height);
// 	}
// }

// class User {
// 	constructor() {
// 		super();
// 		this.color = 'red';
// 	}
// 	draw() {
// 		ctx.drawImage(bgImage, -this.x + 150, -this.y + 150);
// 		ctx.fillStyle = this.color;
// 		ctx.fillRect(150, 150, this.width, this.height);
// 	}
// }

// startAnimating(60);

// function startAnimating(fps = 20) {
// 	fpsInterval = 1000 / fps;
// 	then = Date.now();
// 	startTime = then;
// 	animate();
// }

// function animate() {

// 	// stop
// 	if (stop) {
// 		return;
// 	}
// 	// request another frame
// 	requestAnimationFrame(animate);
// 	// calc elapsed time since last loop
// 	now = Date.now();
// 	elapsed = now - then;
// 	// if enough time has elapsed, draw the next frame

// 	if (elapsed > fpsInterval) {

// 		// Get ready for next frame by setting then=now, but...
// 		// Also, adjust for fpsInterval not being multiple of 16.67
// 		// then = now - (elapsed % fpsInterval);
// 		ctx.clearRect(0, 0, 300, 300);

// 		players[socket.id].draw();

// 		for (let key in players) {
// 			if (key !== socket.id) {
// 				players[key].draw();
// 			}
// 		}

// 		// TESTING...Report #seconds since start and achieved fps.
// 		var sinceStart = now - startTime;
// 		var currentFps = Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100;
// 		$results.text("Elapsed time= " + Math.round(sinceStart / 1000 * 100) / 100 + " secs @ " + currentFps + " fps.");
// 	}
// }

