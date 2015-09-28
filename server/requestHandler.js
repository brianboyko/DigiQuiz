var models = require('./models.js');
// var auth  = require ('./auth.js');

module.exports = {
	gameCodes: {"empty":"empty"}, //lets lines 20/21 be written very cleanly

	gameMaker: function(req, res){
		// this works! type this in the terminal:
		//// curl -X POST --header "username: billy" localhost:8000/newGame
		//// you will get get back a game code.
		//// curl localhost:8000/game-dash/*insert game code here*
		//// on the server, you will see an announcement of who the owner is.

		// here we set that game's unique id and we verify that, by some
		// small chance, that number is actually unique.
		var possible = "BCDFGHJKLMNPQRSTVWXZ";
		// For obvious reasons, these words should not be condoned. 
		// If the random generator runs into one of thses, it'll just reroll.
		var badWords = ['NGGR', 'NGRR', 'NNGR', 'CVNT', 'FVCK', 'SHJT'];

		do {
	    var code = "";
      for( var i=0; i < 4; i++ ){
      code += possible.charAt(Math.floor(Math.random() * possible.length));
    	}
		} while (this.gameCodes[code] || (badWords.indexOf(code) != -1)) // while game code is taken or it has created a bad word


		// should take in username, something like req.headers.username
		// and make that user the only one able to access the game-dash
		var username = req.headers.username;
		// set that code to that username in our dictionary of active games.
		this.gameCodes[code] = username;
		console.log("created gamecodes: " + code + ", " + username);
		console.log("current gameCodes: ");
		console.log(this.gameCodes);
		res.send("your gamecode is " + code + ", and username of owner is: " + username);
	},

	endGame: function(req, res){
		// need to think about all the things to happen here.
		// client side saving, or server side saving of stats?
		delete gameCodes[req.headers.code];
	},

	signup: function(req, res){
		var username = req.headers.username;
		var password = req.headers.password;
		models.createUser(username,password)
		.then(function(result){
			// "your username might be " + username + " and your password could be: " + password

			// this breaks.
			res.send( result() );
		});
	}
};
