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

var width = 2000;
var height = 1000;

var bgImage = new Image();
 bgImage.src = "https://wallpapertag.com/wallpaper/full/6/0/0/294499-large-pattern-background-2560x1600.jpg";

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
	constructor(color='black') {
		this.width = 30;
		this.height = 30;
		// this.x = x;
		// this.y = y;
		this.color = color;
	}
	draw() {
		ctx.fillStyle = this.color;
        ctx.fillRect(this.x - players[socket.id].x + 150,
             this.y - players[socket.id].y + 150,
              this.width, this.height);
	}
}

class User {
	constructor() {
        this.width = 30;
        this.height = 30;
        this.color = 'red';
		
	}
	draw() {
        ctx.drawImage(bgImage, -this.x + 150, -this.y + 150);

		ctx.fillStyle = this.color;
		ctx.fillRect(150, 150, this.width, this.height);
	}
}

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
		ctx.clearRect(0, 0, 300, 300);

		//console.log(players);
		players[socket.id].draw();

		for (let key in players) {
			if (key !== socket.id) {
                players[key].draw();
            }
		}

        // callum.update();
        // console.log(socket.id)
        // console.log(players)

		// TESTING...Report #seconds since start and achieved fps.
		var sinceStart = now - startTime;
		var currentFps = Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100;
		$results.text("Elapsed time= " + Math.round(sinceStart / 1000 * 100) / 100 + " secs @ " + currentFps + " fps.");
	}
}