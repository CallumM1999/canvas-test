var myGamePiece;

function startGame() {
  myGamePiece = new component(30, 30, "rgba(0, 0, 255, 0.1)", 10, 120);
  coords = new textComponent(5, 10, 10, 'hdddddi');

  myGameArea.start();
  coords.display();
}

var myGameArea = {
  canvas: document.createElement('canvas'),
  start: function() {
    this.canvas.width = 2000;
    this.canvas.height = 1000;
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener('mousemove', function (e) {
            myGameArea.x = e.pageX;
            myGameArea.y = e.pageY;
          })
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function textComponent(x, y, fontSize, text) {
    this.x = x;
    this.y = y;
    this.font = `${fontSize}px Arial`;
    this.text = text;

    this.display = function() {

      ctx = myGameArea.context;

      console.log(this.x)
      console.log(this.y)

      ctx.font = this.font;
      ctx.fillStyle = "#000";
      ctx.fillText(`x:${myGamePiece.x}, y:${myGamePiece.y}`, this.x, this.y);
    }

    this.update = function() {
      ctx.fillStyle = "#000";
      ctx.fillText(`x:${myGameArea.x}, y:${myGameArea.y}`, this.x, this.y)
    }
}


function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.update = function() {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

function updateGameArea() {
  myGameArea.clear();

  const speed = 3;

  if (myGameArea.x > myGamePiece.x +15 && myGamePiece.x +30 < 2000) {
    myGamePiece.x += speed;
  } else if (myGameArea.x < myGamePiece.x +15 && myGamePiece.x > 0) {
    myGamePiece.x -= speed;
  }

  if (myGameArea.y > myGamePiece.y +15 && myGamePiece.y +30 < 1000) {
    myGamePiece.y += speed;
  } else if (myGameArea.y < myGamePiece.y +15 && myGamePiece.y > 0) {
    myGamePiece.y -= speed;
  }



  myGamePiece.newPos();
  myGamePiece.update();
  coords.update();
}

// var move = {
//   up: () => myGamePiece.speedY -= 1,
//   down: () => myGamePiece.speedY -= 1,
//   left: () => myGamePiece.speedX -= 1,
//   right: () => myGamePiece.speedX += 1,
//   stop: () => {
//     myGamePiece.speedX = 0;
//     myGamePiece.speedY = 0;
//   }
// };
