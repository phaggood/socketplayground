// http://code.tutsplus.com/tutorials/real-time-chat-with-nodejs-socketio-and-expressjs--net-31708
var express = require("express");
var app = express();
var port = 3700;

app.set('views', __dirname + '/templates');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

app.get("/", function(req, res){
    res.render("page");
});

app.get("/", function(req, res){
    res.send("Chatserver v.001 (c) 2014 Spieleware");
});

app.use(express.static(__dirname + '/public'));
//app.listen(port);
var io = require('socket.io').listen(app.listen(port));
var names = [];

console.log("Listening on port " + port);

io.sockets.on('connection', function (socket) {

    // send a general message
    socket.emit('message', { message: 'welcome to the chat' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });

    socket.on('join', function(data) {
        var newName = data.newName;
        if (!names.contains(data.newName)){
            names.push(newName);
            socket.emit('message', { message: newName + 'added to the chat' });
        } else {
            // should only send reject message to sending server
        }
    });

    socket.on('leave', function(data) {
        var username = data.username;
        if (names.contains(username)){
            names.pop(username);
            socket.emit('message', { message: newName + 'left the chat' });
        } else {
            // should only send reject message to sending server
        }
    });

    socket.on('comment', function(data) {
        var username = data.username;
        var comment = data.comment;

        if (names.contains(username)) {
            if (comment != undefined) {
                socket.emit('message', {message: username + " says: " + comment})
            } else {
                socket.emit('message', {message: username + " is at a loss for words "})
            }
        } else {
            // log unregistered comment?
        }
    })
});