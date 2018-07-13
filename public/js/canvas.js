
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

class Player {
  constructor() {
    this.width = 30;
    this.height = 30;
    this.x = 100;
    this.y = 100;
  }
  draw() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class User extends Player{
  constructor() {
    super();
    this.x_speed = 0;
    this.y_speed = 0;
 }
  update() {
    this.x += this.x_speed;
    this.y += this.y_speed;
  }
}

$(document).keydown(e => {
  if (e.key === 'ArrowUp') {
    callum.y_speed = -1;
  }
  if (e.key === 'ArrowDown') {
    callum.y_speed = 1;
  }
  if (e.key === 'ArrowLeft') {
    callum.x_speed = -1;
  }
  if (e.key === 'ArrowRight') {
    callum.x_speed = 1;
  }
});
$(document).keyup(e => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') callum.y_speed = 0;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') callum.x_speed = 0;
});

var callum = new User();



startAnimating(144);

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    console.log(startTime);
    animate();
}

// const findPlayerIndex = id => {
//   returnVal = {index: null};
//   console.log(players);
//   players.forEach((item, index) => {
//     console.log('index', index);
//     console.log('itemid', item.id);
//     if (item.id === id) {
//       console.log('findindex', index);
//       returnVal = {index};
//       // return returnVal;
    
//     }
//   });
//   return returnVal;
// }; 


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

      // draw stuff here
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      callum.update();
      callum.draw();
      // console.log('players', players)

      users.forEach((item, index) => {
        if (!players.hasOwnProperty(item.id)) {
          // not in players
          console.log('Not in players', item.id);
          // add player
    
  			  players[item.id] = {x: item.coords.x, y: item.coords.y};
    
  
          console.log('players', players)
          // let playerIndex = players.indexOf(item.id);
          players[item.id] = new Player();
        }
      });

      Object.keys(players).forEach((item, index) => {
        players[item].draw();
      });



        // TESTING...Report #seconds since start and achieved fps.
        var sinceStart = now - startTime;
        var currentFps = Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100;
        $results.text("Elapsed time= " + Math.round(sinceStart / 1000 * 100) / 100 + " secs @ " + currentFps + " fps.");

    }
}