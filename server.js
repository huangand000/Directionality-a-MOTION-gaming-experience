/**************/
/*** CONFIG ***/
/**************/
var PORT = 8000;


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
mongoose.connect('mongodb://localhost/ddrdb');
mongoose.Promise = global.Promise
var path = require("path");
var io  = require('socket.io').listen(server);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use('/static', express.static('static'));

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

//io.set('log level', 2);

server.listen(PORT, null, function() {
    console.log("Listening on port " + PORT);
});
//app.use(express.bodyParser());

app.get('/', function(req, res){ 
    res.render('home'); 
});

app.post('/create', function(req, res) {
    User.create(req.body, function(err) {
        if (err) {
            console.log(req.body.user_name + " already exists")
            res.redirect('/')
        } else {
            req.session.user_name = req.body.user_name;
            console.log(req.session.user_name)
            res.redirect('motion/' + req.session.user_name)
        }
    })
    console.log(req.body)
})
// app.get('/index.html', function(req, res){ res.sendfile('newclient.html'); });
// app.get('/client.html', function(req, res){ res.sendfile('newclient.html'); });

app.get('/motion/:user_name', function(req, res){ 
    console.log(req.params.user_name)
    res.render('motion', req.params.user_name); 
});

app.get('/ddr', function(req, res) {
    res.render('jsRev');
})
app.get('/chart', function(req, res) {
    res.render('chart');
})




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
