/*
  Create circle object that moves
  on each refresh, send coords to server (send volitile message)

  create function to draw other objets controlled by other users
https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
*/
var stop = false;
var frameCount = 0;
var $results = $("#results");
var fps, fpsInterval, startTime, now, then, elapsed;
var $canvas = $('canvas');


const ctx = this.canvas.getContext('2d');
const $document = $(document);

const colors = [
    '#FBD40E',
    '#B1CD1B',
    '#6E8B5E',
    '#22534D',
    '#1B262A'
];

class Player {
	constructor(x = 0, y = 0, color='black') {
		this.width = 30;
		this.height = 30;
		this.x = x;
		this.y = y;
		this.color = color;
	}
	draw() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

// class User extends Player {
// 	constructor(color = 'red') {
// 		super();
// 		this.x_speed = 0;
// 		this.y_speed = 0;
// 		this.color = color;
// 		this.keyup = $document.keydown(e => {
// 			if (e.key === 'ArrowUp') this.y_speed = -1;
// 			if (e.key === 'ArrowDown') this.y_speed = 1;
// 			if (e.key === 'ArrowLeft') this.x_speed = -1;
// 			if (e.key === 'ArrowRight') this.x_speed = 1;
// 		});
// 		this.keydown = $document.keyup(e => {
// 			if (e.key === 'ArrowUp' || e.key === 'ArrowDown') callum.y_speed = 0;
// 			if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') callum.x_speed = 0;
// 		});
// 	}
// 	update() {
// 		this.x += this.x_speed;
// 		this.y += this.y_speed;
// 	}
// }

// var callum = new User('#868686');
startAnimating(60);


function startAnimating(fps = 20) {
	fpsInterval = 1000 / fps;
	then = Date.now();
	startTime = then;
	animate();
}

function animate() {

	// stop
	if (stop) {
		return;
	}
	// request another frame
	requestAnimationFrame(animate);
	// calc elapsed time since last loop
	now = Date.now();
	elapsed = now - then;
	// if enough time has elapsed, draw the next frame

	if (elapsed > fpsInterval) {

		// Get ready for next frame by setting then=now, but...
		// Also, adjust for fpsInterval not being multiple of 16.67
		// then = now - (elapsed % fpsInterval);
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		//console.log(players);

		for (let key in players) {
			// if (key !== socketID) {
                players[key].draw();
            // }
		}

		// callum.update();
		// callum.draw();

		// TESTING...Report #seconds since start and achieved fps.
		var sinceStart = now - startTime;
		var currentFps = Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100;
		$results.text("Elapsed time= " + Math.round(sinceStart / 1000 * 100) / 100 + " secs @ " + currentFps + " fps.");
	}
}