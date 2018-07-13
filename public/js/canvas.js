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

players = {};

ctx = this.canvas.getContext('2d');
$document = $(document);

class Player {
    constructor() {
        this.width = 30;
        this.height = 30;
        this.x = 100;
        this.y = 100;
        this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class User extends Player {
    constructor() {
        super();
        this.x_speed = 0;
        this.y_speed = 0;
        this.color = 'red';
        this.keyup = $document.keydown(e => {
            if (e.key === 'ArrowUp') this.y_speed = -1;
            if (e.key === 'ArrowDown') this.y_speed = 1;
            if (e.key === 'ArrowLeft') this.x_speed = -1;
            if (e.key === 'ArrowRight') this.x_speed = 1;
        });
        this.keydown = $document.keyup(e => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') callum.y_speed = 0;
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') callum.x_speed = 0;
        });
    }
    update() {
        this.x += this.x_speed;
        this.y += this.y_speed;
    }
}

var callum = new User();
startAnimating(144);

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    console.log(startTime);
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
        then = now - (elapsed % fpsInterval);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        users.forEach((item, index) => {
            if (!players.hasOwnProperty(item.id)) {
                console.log('Not in players', item.id);
                players[item.id] = {
                    x: item.coords.x,
                    y: item.coords.y
                };
                console.log('players', players);
                players[item.id] = new Player();
            }
        });

        Object.keys(players).forEach((item, index) => {
            players[item].draw();
        });

        callum.update();
        callum.draw();


        // TESTING...Report #seconds since start and achieved fps.
        var sinceStart = now - startTime;
        var currentFps = Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100;
        $results.text("Elapsed time= " + Math.round(sinceStart / 1000 * 100) / 100 + " secs @ " + currentFps + " fps.");
    }
}