/**************/
/*** CONFIG ***/
/**************/


/*************/
/*** SETUP ***/
/*************/
var express = require('express');
var http = require('http');
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));
const session = require('express-session');
app.use(session({secret: 'codingdojo'}));
var server = http.createServer(app)
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/ddrdb');
mongoose.Promise = global.Promise
var path = require("path");
var io  = require('socket.io').listen(server);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use('/static', express.static('static'));
const {isRealString} = require('./static/js/validation');

var Schema = mongoose.Schema;
var UserSchema = mongoose.Schema({
    user_name: {
        type: String,
        required: true,
        unique: true
    },
    games: [{
        gameNumber: Number,
        perfect: Number,
        great: Number,
        good: Number,
        cool: Number,
        bad: Number,
    }]
}, {timestamps: true})
mongoose.model('User', UserSchema);
var User = mongoose.model('User')
var rooms = {}

//io.set('log level', 2);

var server = app.listen(8000, function() {
    console.log("Listening on port on 8000");
});
//app.use(express.bodyParser());

app.get('/', function(req, res){ 
    res.render('home', {allRooms: rooms}); 
});

app.get('/template', function(req, res) {
    res.render('template', {allRooms: rooms});
})

// app.get('/index.html', function(req, res){ res.sendfile('newclient.html'); });
// app.get('/client.html', function(req, res){ res.sendfile('newclient.html'); });
app.get('/tempmotion', function(req, res){ 
    res.render('tempmotion'); 
});
app.get('/motion', function(req, res){ 
    res.render('motion'); 
});
app.get('/elements', function(req, res){ 
    res.render('elements'); 
});
app.get('/existing/:url', function(req, res) {
    console.log(req.params.url)
    console.log('gi')
    console.log('REQ BODY', req.body)
    // res.render('/motion/)
});


app.get('/ddr', function(req, res) {
    res.render('jsRev');
})
app.get('/chart', function(req, res) {
    res.render('chart');
})
var count = 0;
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    console.log("Client/socket id is: ", socket.id);
    socket.on('join', function (params, callback) {
        if (!rooms[params.room_name]) {
            rooms[params.room_name] = [socket.id]
        } else if (isRealString(params.user_name) && isRealString(params.room_name)){
            rooms[params.room_name].push(socket.id)
        }
        console.log('OUR ROOMS', rooms)
        if (!isRealString(params.user_name) || !isRealString(params.room_name)) {
            callback('Name and room name are required')
        }
        socket.join(params.room_name)
        callback();
        console.log('ROOMS!!', io.sockets.adapter.rooms)
        socket.on("disconnect", function() {

            for (var room in rooms) {
                console.log('BEOFRE', rooms[room])
                if(rooms[room].indexOf(socket.id) != -1) {
                    console.log('STUFF HERE', rooms[room].indexOf(socket.id))
                    rooms[room].splice(rooms[room].indexOf(socket.id), 1)
                }
                if (rooms[room].length == 0) {
                    delete rooms[room]
                }
            }
            console.log('AFTER', rooms[room])
            console.log(socket.id, ' Disconnectedd')
        })
        socket.on("gotResult", function (data){
            console.log('Got result: ', data.result);
            console.log(socket)
            socket.broadcast.to(params.room_name).emit('emitResult', data)
        });
        socket.on("gotResult2", function (){
            console.log(socket)
            socket.broadcast.to(params.room_name).emit('emitResult2')
        });
        socket.on("gameStart", function (id){
            count++;
            console.log(count)
            if (count == 2) {
            io.sockets.to(params.room_name).emit('gameStarting')
                count = 0;
            }
        });
    })
    
    
    // socket.on("checkArrow", function (arrow){
    //     console.log("ARROWWOWWOOWOWOWOWOWOW", arrow)
    //     socket.emit('sendArrow', arrow);

    // });
    // socket.on("newNote", function (notes){
    //     console.log("notessss", notes);
    //     socket.emit('updatedNotes', notes);

    //     // io.emit('updatedNotes', notes);
    // });
});




/*************************/
/*** INTERESTING STUFF ***/
/*************************/
var channels = {};
var sockets = {};

/**
 * Users will connect to the signaling server, after which they'll issue a "join"
 * to join a particular channel. The signaling server keeps track of all sockets
 * who are in a channel, and on join will send out 'addPeer' events to each pair
 * of users in a channel. When clients receive the 'addPeer' even they'll begin
 * setting up an RTCPeerConnection with one another. During this process they'll
 * need to relay ICECandidate information to one another, as well as SessionDescription
 * information. After all of that happens, they'll finally be able to complete
 * the peer connection and will be streaming audio/video between eachother.
 */
io.sockets.on('connection', function (socket) {
    socket.channels = {};
    sockets[socket.id] = socket;

    console.log("["+ socket.id + "] connection accepted");
    socket.on('disconnect', function () {
        for (var channel in socket.channels) {
            part(channel);
        }
        console.log("["+ socket.id + "] disconnected");
        delete sockets[socket.id];
    });


    socket.on('join', function (config) {
        console.log("["+ socket.id + "] join ", config);
        var channel = config.channel;
        var userdata = config.userdata;

        if (channel in socket.channels) {
            console.log("["+ socket.id + "] ERROR: already joined ", channel);
            return;
        }

        if (!(channel in channels)) {
            channels[channel] = {};
        }

        for (id in channels[channel]) {
            channels[channel][id].emit('addPeer', {'peer_id': socket.id, 'should_create_offer': false});
            socket.emit('addPeer', {'peer_id': id, 'should_create_offer': true});
        }

        channels[channel][socket.id] = socket;
        socket.channels[channel] = channel;
    });

    function part(channel) {
        console.log("["+ socket.id + "] part ");

        if (!(channel in socket.channels)) {
            console.log("["+ socket.id + "] ERROR: not in ", channel);
            return;
        }

        delete socket.channels[channel];
        delete channels[channel][socket.id];

        for (id in channels[channel]) {
            channels[channel][id].emit('removePeer', {'peer_id': socket.id});
            socket.emit('removePeer', {'peer_id': id});
        }
    }
    socket.on('part', part);

    socket.on('relayICECandidate', function(config) {
        var peer_id = config.peer_id;
        var ice_candidate = config.ice_candidate;
        console.log("["+ socket.id + "] relaying ICE candidate to [" + peer_id + "] ", ice_candidate);

        if (peer_id in sockets) {
            sockets[peer_id].emit('iceCandidate', {'peer_id': socket.id, 'ice_candidate': ice_candidate});
        }
    });

    socket.on('relaySessionDescription', function(config) {
        var peer_id = config.peer_id;
        var session_description = config.session_description;
        console.log("["+ socket.id + "] relaying session description to [" + peer_id + "] ", session_description);

        if (peer_id in sockets) {
            sockets[peer_id].emit('sessionDescription', {'peer_id': socket.id, 'session_description': session_description});
        }
    });
 });
