var bodyParser  = require('body-parser');
var express     = require('express');
// var server = require('http').createServer(app);
var morgan      = require('morgan');
var handler     = require('./server/requestHandler.js');
var http 				= require('http');
var io          = require('socket.io');

var app = express();
// process.env.PORT is provided by the deployment server -- if we're running localhost, use 8000;
var PORT = process.env.PORT || 8000;
app.use(bodyParser.json());


// Everything in the /client directory and subdirectories will be served at [hostname]/client.
// As of now, there is no route to '/' so don't worry if you get a "cannot GET" error at Localhost:8000
app.use('/client',express.static(__dirname + '/client'));
app.use(morgan('dev'));

app.get('/signup',
	function(req, res){
		// req.headers.username
		// req.headers.password
		console.log("signup!");
		res.send(200);
	}
);

app.get('/data',
	function(req, res){
		// db.getStudentData(req.headers.token)
	}
);

app.get('/game-dash/:code',
	function(req, res){
		var user = req.headers.username;
		var code = req.params.code;
		console.log("owner is " + handler.gameCodes[code]);
		console.log("game dash for code " + code);

		if (user === handler.gameCodes[code])
			res.send("access granted to user: " + user);
		else
			res.send("access denied to user: " + user + ", you are not owner: " + handler.cameCodes[code]);
	}
);

app.get('/student/:code',
	function(req, res){
		var code = req.params.code;
		console.log("student view for code " + code);
		res.send(200);
	}
);

app.post('/new-game',
	function(req,res){
		handler.gameMaker(req, res);
	}
);

console.log('App is listening on port ' + PORT);
// We require socket.io to have the entire server passed in as an argument,
// so we create a server variable to pass into socket.io's .listen method.
var server = app.listen(PORT);
var io = require('socket.io').listen(server);

module.exports = app;

//--------------------------------
// WEBSOCKETS
//--------------------------------

//Everything that requires Websockets lives INSIDE this callback.
io.sockets.on('connection', function(socket) {

	socket.on('buzz', function(studentBuzzer) {
		console.log("ServerSide Student: ", studentBuzzer.name, "Room: ", studentBuzzer.room, "Timestamp:", studentBuzzer.timestamp);
		io.emit('buzzResponse', ('buzzResponse recieved from server after ' + studentBuzzer.name + ' hit the buzzer at ' + studentBuzzer.timestamp + ' in ' + studentBuzzer.room));
	}); // end chat message

});

//--------------------------------
// END WEBSOCKETS
//--------------------------------

// roadmap below here

// signup
// sockets stuff
// "/game-dash:code"
// "/student:code"
// "/main-dash" reads username, shows that user's dash

//student facing sockets
//
// io.on('connection', function(){
// 	socket.on('buzzClientEmit', function(student){
// 		console.log(student.name + " connected");
// 	});
// 	socket.on('disconnect', function(){
//
// 	});
// });
