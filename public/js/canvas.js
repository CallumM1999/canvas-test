




// /*
//   Create circle object that moves
//   on each refresh, send coords to server (send volitile message)

//   create function to draw other objets controlled by other users

// */

// const game = (() => {
//   var me;
//   var players = [];
//   /*
//   [{socket:
//     coords: {
//       x:
//       y:
//   }}];
//   */

//   const startGame = () => {
//     me = new user();

//     gameEnv.start();
//   };

//   const gameEnv = {
//     canvas: document.createElement('canvas'),
//     start: function () {
//       console.log('starting game');
//       this.canvas.width = 200;
//       this.canvas.height = 100;
//       // this.width = this.canvas.width;
//       // this.height = this.canvas.height;
//       this.ctx = this.canvas.getContext('2d');
//       document.body.insertBefore(this.canvas, document.body.childNodes[0]);
//       this.setupInterval();
//       this.setupEventListeners();
//     },
//     setupEventListeners: function () {
//       window.addEventListener('keydown', function (e) {
//         move(e.code);
//         // console.log(`${e.code} has been pressed`);
//       });
//       window.addEventListener('keyup', function (e) {
//         // console.log(`unpress`);
//         move(false);
//       });
//     },
//     setupInterval: function () {
//       this.interval = setInterval(updateCanvas, 1000);
//     },
//     clear: function () {
//       this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//     }
//   };

//   const updateCanvas = function () {
//     // var previous = {x: }
//     gameEnv.clear();
//     me.updatePosition();
//     me.update();
//     console.log(`x:${me.x}, y:${me.y}`)
//     socket.emit('coords', {x: me.x, y: me.y});

//     console.log('length of players : ', game.players.length)
//     for (let i=0;i<game.players.length - 1;i++) {
//       game.players[i] = new player;
//       game.players[i].update(game.players[i].coords.x, game.players[i].coords.y)

//       console.log(game.players[i])
//     }
//     console.log('========')
//   };



//   let user = function () {
//       this.width = 30;
//       this.height = 30;
//       this.x = 100;
//       this.y = 50;
//       // this.x = (gameEnv.width) /2;
//       // this.y = gameEnv.height /2;
//       this.x_speed = 0;
//       this.y_speed = 0;
//       // console.log(gameEnv.width)

//       this.update = function() {
//         // console.log('updating user', this.x)
//         ctx = gameEnv.ctx;
//         ctx.fillStyle = 'red';
//         ctx.fillRect(this.x, this.y, this.width, this.height);
//       };
//       this.updatePosition = function() {
//         this.x = this.x_speed;
//         this.y = this.y_speed;
//       };
//   };

//   let player = function () {
//       this.width = 30;
//       this.height = 30;
//       this.x = 100;
//       this.y = 50;
//       // this.x = (gameEnv.width) /2;
//       // this.y = gameEnv.height /2;
//       this.x_speed = 0;
//       this.y_speed = 0;
//       // console.log(gameEnv.width)

//       this.update = function(x, y) {
//         console.log(`updating player ${x},${y}`)
//         // console.log('updating user', this.x)
//         ctx = gameEnv.ctx;
//         ctx.fillStyle = 'blue';
//         ctx.fillRect(x, y, this.width, this.height);
//       };
//       // this.updatePosition = function() {
//       //   this.x = this.x_speed;
//       //   this.y = this.y_speed;
//       // };
//   };

// let move = function(val) {
//   // if (!val) {
//   //   // me.x_speed = 0;
//   //   // me.y_speed = 0;
//   //   return;
//   // }



//   if (me.x > 0 && val === 'ArrowLeft') { me.x_speed -= 3 } else
//   if (me.x < 170 && val === 'ArrowRight') { me.x_speed += 3 } else
//   if (me.y > 0 && val === 'ArrowUp') {me.y_speed -=3 } else
//   if (me.y < 70 && val === 'ArrowDown') {me.y_speed += 3};
// };


//   return {startGame, players};
// })();






// // var myGamePiece;
// //
// // function startGame() {
// //   myGamePiece = new component(30, 30, "rgba(0, 0, 255, 0.1)", 10, 120);
// //   coords = new textComponent(5, 10, 10, 'hdddddi');
// //
// //   myGameArea.start();
// //   coords.display();
// // }
// //
// // var myGameArea = {
// //   canvas: document.createElement('canvas'),
// //   start: function() {
// //     this.canvas.width = 2000;
// //     this.canvas.height = 1000;
// //     this.context = this.canvas.getContext('2d');
// //     document.body.insertBefore(this.canvas, document.body.childNodes[0]);
// //     this.interval = setInterval(updateGameArea, 20);
// //     window.addEventListener('mousemove', function (e) {
// //             myGameArea.x = e.pageX;
// //             myGameArea.y = e.pageY;
// //           })
// //   },
// //   clear: function() {
// //     this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
// //   }
// // }
// //
// // function textComponent(x, y, fontSize, text) {
// //     this.x = x;
// //     this.y = y;
// //     this.font = `${fontSize}px Arial`;
// //     this.text = text;
// //
// //     this.display = function() {
// //
// //       ctx = myGameArea.context;
// //
// //       console.log(this.x)
// //       console.log(this.y)
// //
// //       ctx.font = this.font;
// //       ctx.fillStyle = "#000";
// //       ctx.fillText(`x:${myGamePiece.x}, y:${myGamePiece.y}`, this.x, this.y);
// //     }
// //
// //     this.update = function() {
// //       ctx.fillStyle = "#000";
// //       ctx.fillText(`x:${myGameArea.x}, y:${myGameArea.y}`, this.x, this.y)
// //     }
// // }
// //
// // function component(width, height, color, x, y) {
// //   this.width = width;
// //   this.height = height;
// //   this.x = x;
// //   this.y = y;
// //   this.speedX = 0;
// //   this.speedY = 0;
// //   this.update = function(x, y) {
// //     ctx = myGameArea.context;
// //     ctx.fillStyle = color;
// //     ctx.fillRect(x, y, this.width, this.height);
// //   }
// //   this.newPos = function(x, y) {
// //     this.x = x;
// //     this.y = y;
// //   }
// // }
// //
// // function updateGameArea() {
// //   myGameArea.clear();
// //
// //   const speed = 3;
// //
// //   if (myGameArea.x > myGamePiece.x +15 && myGamePiece.x +30 < 2000) {
// //     myGamePiece.x += speed;
// //   } else if (myGameArea.x < myGamePiece.x +15 && myGamePiece.x > 0) {
// //     myGamePiece.x -= speed;
// //   }
// //
// //   if (myGameArea.y > myGamePiece.y +15 && myGamePiece.y +30 < 1000) {
// //     myGamePiece.y += speed;
// //   } else if (myGameArea.y < myGamePiece.y +15 && myGamePiece.y > 0) {
// //     myGamePiece.y -= speed;
// //   }
// //
// //   // myGamePiece.newPos();
// //   // myGamePiece.update();
// //   coords.update();
// // }

// // var move = {
// //   up: () => myGamePiece.speedY -= 1,
// //   down: () => myGamePiece.speedY -= 1,
// //   left: () => myGamePiece.speedX -= 1,
// //   right: () => myGamePiece.speedX += 1,
// //   stop: () => {
// //     myGamePiece.speedX = 0;
// //     myGamePiece.speedY = 0;
// //   }
// // };
