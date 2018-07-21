const express = require('express');

const app = express();
const hbs = require('express-handlebars');
// const io = require('socket.io')(server);

app.engine('handlebars', hbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Server started on PORT ${port}`));

app.get('/', function(req, res) {
    // res.sendFile('public/index.html', {root: './'});
    res.render('home', {
        port
    });
});

let clients = {};

function addClient(id, username) {
    console.log('adding client');
    clients[id] = {
        username,
        x: 0,
        y: 0,
        x_speed: 0,
        y_speed: 0
    };
}

io.on('connection', socket => {
    socket.on('new_client_connect', data => {
        addClient(socket.id, data.username);
    });

    socket.on('update_player_direction', data => {
        clients[socket.id].x_speed = data.x_speed;
        clients[socket.id].y_speed = data.y_speed;
    });

    socket.on('disconnect', () => {
        delete clients[socket.id];
        console.log('client disconnected', socket.id);
        io.emit('client_disconnect', socket.id);
    });
});


function getRate() {
    let time, fps, delta, output, lastCalledTime;
    time = process.hrtime()[0] * 1000 + process.hrtime()[1] / 1000000;
    if (!lastCalledTime) {
        lastCalledTime = time;
        fps = 0;
        return;
    }
    fps = (time - lastCalledTime) / 1000;
    delta = (time - lastCalledTime) / 1000;
    lastCalledTime = time;
    output = Math.floor(1 / delta);

    console.log(output + ' seconds');
}

function updateUserCoords() {
    let x, y, x_speed, y_speed, left_blocked, right_blocked, up_blocked, down_blocked, player_x, player_y;

    for (let key in clients) {
        if (clients.hasOwnProperty(key)) {

            ({
                x,
                y
            } = clients[key]);
            ({
                x_speed,
                y_speed
            } = clients[key]);

            left_blocked = right_blocked = up_blocked = down_blocked = false;

            for (let player_key in clients) {
                if (player_key !== key) {

                    player_x = clients[player_key].x;
                    player_y = clients[player_key].y;

                    if ((player_x > x - 30 -0 && player_x < x + 30 +0) && (player_y > y - 30 -0 && player_y < y + 30 +0)) {
                        if (x < player_x && (y > player_y -29 && y < player_y +29)) right_blocked = true;
                        if (x > player_x && (y > player_y -29 && y < player_y +29)) left_blocked = true;
                        if (y < player_y && (x > player_x -29 && x < player_x +29)) down_blocked = true;
                        if (y > player_y && (x > player_x -29 && x < player_x +29)) up_blocked = true;
                        // console.log(`left:${left_blocked} right:${right_blocked} up:${up_blocked} down:${down_blocked}`);
                    }
                }
			}
			
			// width/height - 30px
			// 600 x 400 (add 1 for grid)

            if (!left_blocked && x_speed === -1 && x > 0) clients[key].x -= 1;
            else if (!right_blocked && x_speed === 1 && x < 571) clients[key].x += 1;
            if (!up_blocked && y_speed === -1 && y > 0) clients[key].y -= 1;
            else if (!down_blocked && y_speed === 1 && y < 371) clients[key].y += 1;
        }
    }
    getRate();
}

function sendCoordsToClients() {
    let returnObj = {};
    for (let key in clients) {
        if (clients.hasOwnProperty(key)) {

            returnObj[key] = {
                x: clients[key].x,
                y: clients[key].y,
                color: clients[key].color
            };

        }
    }
    io.volatile.emit('send_coords_to_clients', returnObj);
}

setInterval(function() {
    updateUserCoords();
    sendCoordsToClients();
}, 10);