//Variables (Client ID, Websocket, Button data)
let url = "http://localhost:27001/game";
let playerId = null;
let gameId = null;
let clickcounter = null;
let deckClickCounter1 = null;
let startClickCounter1 = null;
let deletedNode = null;
let makeBoard1 = null;
let makeBoard2R = null;
let makeBoard2C = null;
let ws = new WebSocket("ws://localhost:27000");


const joinButton = document.getElementById("join-button");
const theGameId = document.getElementById("theGameId");
// Live log feed lives here
const divChatLog = document.getElementById("divChatLog");
const divBoard = document.getElementById("divBoard");

window.onunload = function() {
	const gameData = {
		"method": "exit",
		"playerId": playerId,
		"gameId": gameId
	}
	ws.send(JSON.stringify(gameData));
}

document.getElementById("leave-button").addEventListener("click", x => {
	if (confirm("Are you sure you want to leave the game?")) {

		const gameData = {
			"method": "exit",
			"playerId": playerId,
			"gameId": gameId
		}

		ws.send(JSON.stringify(gameData));
		//back to main page
		window.location.href = '/';
	}
	else {
		return;
	}
});


joinButton.addEventListener("click", x => {
	let username = document.getElementById('username').value;
	if(username === "") {
		alert("Please enter username!");
		return;
	}

	let usernameDiv = document.getElementById('divEnterUsername');
	usernameDiv.style.display = "none";



		if (gameId === null) {
			gameId = document.getElementById('theGame').textContent;
		}

		gameId = gameId.toUpperCase();

		const gameData = {
			"method": "join",
			"playerId": playerId,
			"username": username,
			"gameId": gameId,
			"startCode": 0
		}

		ws.send(JSON.stringify(gameData));

	//}

});

//Websocket communication
ws.onmessage = message => {
	//message data JSON
	const response = JSON.parse(message.data);

	if(response.method === "end"){
		const gameNum = response.id;

		const gameID = { gameID: gameNum };
		let addToGame = 99;

		fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json',},
			body: JSON.stringify({gameID, "addDelete":addToGame}),
		})
		.then(response => response.json())
		.then(gameID => {
		})
		.catch((error) => {
		});

	}

	//connect
	if (response.method === "connect"){
		playerId = response.playerId;
		console.log("Player ID: " + playerId + " connected.");
	}

	//host game
	if (response.method === "host") {
		gameId = response.game.id;
		console.log("Game ID: " + response.game.id + " with " + response.game.cards + " cards was created");
	}


	if (response.method === 'host-join'){
		gameId = response.game.id;

		let leaveButton = document.getElementById('leave-button');
		leaveButton.style.display = "block";


		createLogFeed(response.chatLog);

		pixiStart(response.boardState);



		ws.onmessage = message => {

			const response = JSON.parse(message.data);

			//connect
			if (response.method === "connect"){
				playerId = response.playerId;
				console.log("Player ID: " + playerId + " connected.");
			}

			//host game
			if (response.method === "host") {
				gameId = response.game.id;
				console.log("Game ID: " + response.game.id + " with " + response.game.cards + " cards was created");
			}

			//update gamestate
			if (response.method === "update") {
				//no state no game
				if (!response.game.boardState) return;

				response.game.boardState.forEach((card, i) => {
					cards[i].name = card.name
					cards[i].connections = card.connections;
					cards[i].cardFlipped = card.cardFlipped;
					cards[i].moveMade = card.moveMade;
				});

			}


			// Update live log/chat
			if (response.method === 'updateChat') {
				let chatMessage = document.createElement('p');
				chatMessage.textContent = response.chatMessage;
				document.getElementById('chat-messages').appendChild(chatMessage);
				const messageDiv = document.getElementById('chat-messages');
				let xH = messageDiv.scrollHeight;
				messageDiv.scrollTo(0, xH);
			}

			// Create file with game data and download to local machine
			if (response.method === 'download') {
				downloadLog(response.chatLog);
			}

			if (response.method === "startGame"){

				var hostmsg = document.getElementById("host-message");
				hostmsg.parentNode.removeChild(hostmsg);

				let leaveButton = document.getElementById('leave-button');
				leaveButton.style.display = "block";


				var update = "Your game is starting now."
				var starting = document.getElementById("game-starting");
				var p = document.createElement('p');
				p.appendChild(document.createTextNode(update));
				starting.appendChild(p);

				createLogFeed(response.chatLog);

				pixiStart(response.boardState);
			}


			if (response.method === "end"){
				const gameNum = response.id;

				const gameID = { gameID: gameNum };
				let addToGame = 99;

				fetch(url, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json',},
					body: JSON.stringify({gameID, "addDelete":addToGame}),
				})
				.then(response => response.json())
				.then(gameID => {
				})
				.catch((error) => {
				});

			}
		}


	}

	//update gamestate
	if (response.method === "update") {
		//no state no game
		if (!response.game.boardState) return;

		response.game.boardState.forEach((card, i) => {
			cards[i].name = card.name
			cards[i].connections = card.connections;
			cards[i].cardFlipped = card.cardFlipped;
			cards[i].moveMade = card.moveMade;
		});

	}


	// Update live log/chat
	if (response.method === 'updateChat') {
		let chatMessage = document.createElement('p');
		chatMessage.textContent = response.chatMessage;
		document.getElementById('chat-messages').appendChild(chatMessage);
		const messageDiv = document.getElementById('chat-messages');
		let xH = messageDiv.scrollHeight;
		messageDiv.scrollTo(0, xH);
	}

	// Create file with game data and download to local machine
	if (response.method === 'download') {
		downloadLog(response.chatLog);
	}

	if (response.method === "startGame"){

		var hostmsg = document.getElementById("host-message");
		hostmsg.parentNode.removeChild(hostmsg);

		let leaveButton = document.getElementById('leave-button');
		leaveButton.style.display = "block";


		var update = "Your game is starting now."
		var starting = document.getElementById("game-starting");
		var p = document.createElement('p');
		p.appendChild(document.createTextNode(update));
		starting.appendChild(p);

		createLogFeed(response.chatLog);

		pixiStart(response.boardState);
	}




	//join game
	if (response.method === "join") {

		//let count = 0;
		let count = response.players.length;

		if(count == 1)
		{
			count++;
			//window.addEventListener('focus', function (event) {


			var jB = document.getElementById("join-button");
			jB.parentNode.removeChild(jB);

			//card names
			var cardIds = ["ambivalence", "anthropomorphism", "art_versus_nature",
				"city_as_artifact", "coding", "contemplation", "creation", "death",
				"education", "emotional_manipulation", "eternity_continuity",
				"freedom", "fundamental_theorem_of_calculus", "gestalt", "harmony",
				"helplessness", "hidden_potential", "intuition", "joy", "magic",
				"metamorphosis", "monetary_value",
				"multiplication_of_mechanical_advantage", "myth",
				"nature_tending_towards_perfection",
				"ontogeny_recapitulates_philogeny", "point_of_view_perspective",
				"reaching_out", "return", "society_as_active_passive_hierarchy",
				"species_specific_norms", "structural_strength",
				"structured_improvisation", "struggle", "symbolic_handles",
				"synergy", "syntax", "the_need_not_to_judge",
				"unwanted_relationships"];

			var cardSelected = [];

			var sizes = ["2x2", "3x3", "4x4", "5x5", "6x6"];

			var cardNames = ["ambivalence", "anthropomorphism", "art versus nature",
				"city as artifact", "coding", "contemplation", "creation", "death",
				"education", "emotional manipulation", "eternity continuity",
				"freedom", "fundamental theorem of calculus", "gestalt", "harmony",
				"helplessness", "hidden potential", "intuition", "joy", "magic",
				"metamorphosis", "monetary value",
				"multiplication of mechanical advantage", "myth",
				"nature tending towards perfection",
				"ontogeny recapitulates philogeny", "point of view perspective",
				"reaching out", "return", "society as active passive hierarchy",
				"species specific norms", "structural strength",
				"structured improvisation", "struggle", "symbolic handles",
				"synergy", "syntax", "the need not to judge",
				"unwanted relationships"];

			function printCheckBoxes(){
				var theDiv = document.getElementById("scroll-div");
				for (var i = 0; i < cardIds.length; i++) {
					var check = document.createElement("INPUT");
					check.setAttribute("type", "checkbox");
					check.id = cardIds[i];
					var label = document.createElement('label')
					label.htmlFor = cardIds[i];
					label.appendChild(document.createTextNode(cardNames[i]));
					linebreak = document.createElement("br");
					theDiv.appendChild(check);
					theDiv.appendChild(label);
					theDiv.appendChild(linebreak);
				}
			}

			function printRadio(){
				var theDiv2 = document.getElementById("scroll-div-2");
				for (var i = 0; i < sizes.length; i++) {
					var radiobox = document.createElement('input');
					radiobox.type = "radio";
					radiobox.id = sizes[i];
					radiobox.name = "size";
					radiobox.value = (i+1) * (i+1);
					if(i == 1){
						radiobox.checked = true;
					}
					var label = document.createElement('label')
					label.htmlFor = sizes[i];
					label.appendChild(document.createTextNode(sizes[i]));
					linebreak = document.createElement("br");
					theDiv2.appendChild(radiobox);
					theDiv2.appendChild(label);
					theDiv2.appendChild(linebreak);
				}
			}

			function printSelectBox(){
				var theDiv4 = document.getElementById("submitBtn");
				var selButn = document.createElement("button");
				selButn.type = "button";
				selButn.innerHTML = "Submit";
				selButn.id = "submitBtn"
				theDiv4.appendChild(selButn);
			}

			var options = ["Random Deck", "Choose Deck"];

			function printOptions(){
				var theDiv3 = document.getElementById("scroll-div-3");
				for (var i = 0; i < options.length; i++) {
					var radiobox = document.createElement('input');
					radiobox.type = "radio";
					radiobox.id = options[i];
					radiobox.name = "options";
					radiobox.value = options[i];
					if(i == 0){
						radiobox.checked = true;
					}
					var label = document.createElement('label')
					label.htmlFor = options[i];
					label.appendChild(document.createTextNode(options[i]));
					linebreak = document.createElement("br");
					theDiv3.appendChild(radiobox);
					theDiv3.appendChild(label);
					theDiv3.appendChild(linebreak);
				}
			}

			printOptions();
			printSelectBox();

			makeBoard1++;

			//Select button code

			const selectButton = document.getElementById("submitBtn");
			const selectDiv = document.getElementById("scroll-div-3");
			selectButton.addEventListener("click", x => {

				deckClickCounter1++;
				if(deckClickCounter1 == 1){

					var optionSelected = options[0];
					for (var i = 0; i < options.length; i++) {
						var optionStatus = document.getElementById(options[i]);
						if(optionStatus.checked){
							optionSelected = optionStatus.value;
						}
					}
					if(optionSelected == options[0]){
						selectButton.style.display = "none";
						selectDiv.style.display = "none";
						printRadio();
						var theBDiv = document.getElementById("button-div");
						var button = document.createElement('button');
						button.type = "button";
						button.className = "all-home-buttons start1";
						button.id = "start-game";
						button.ariaLabel = "start game button";
						button.innerHTML = "start game";
						theBDiv.appendChild(button);
						var sd1 = document.getElementById("scroll-div");
						sd1.parentNode.removeChild(sd1);
						deletedNode++;
						makeBoard2R++;
					}
					if(optionSelected == options[1]){
						printCheckBoxes();
						var theBDiv = document.getElementById("button-div");
						var button = document.createElement('button');
						button.type = "button";
						button.className = "all-home-buttons start2";
						button.id = "start-game";
						button.ariaLabel = "start game button";
						button.innerHTML = "start game";
						theBDiv.appendChild(button);
						makeBoard2C++;


					}

					//button events
					const hostButton = document.getElementById("start-game");
					hostButton.addEventListener("click", x => {



						if(optionSelected == options[1]){
							for (var i = 0; i < cardIds.length; i++) {
								var idstatus = document.getElementById(cardIds[i]);
								if(idstatus.checked){
									cardSelected.push(cardIds[i]);
								}
							}
						} else {
							cardSelected = cardIds;
						}
						if(cardSelected.length <= 1){
							cardSelected = [];
							return;
						}
						var total = 4;
						if(optionSelected == options[0]){
							for (var i = 0; i < sizes.length; i++) {
								var sizeStatus = document.getElementById(sizes[i]);
								if(sizeStatus.checked){
									total = sizeStatus.value;
								}
							}
						} else {
							total = cardSelected.length;
						}
						var deck = [];
						var max = cardSelected.length;
						if(total == max){
							deck = cardSelected;
						} else {
							for(let i = 0; i < total; i++){
								temp = Math.floor(Math.random() * max);
								while(deck.includes(cardSelected[temp])){
									temp = Math.floor(Math.random() * max);
								}
								deck[i] = cardSelected[temp];
							}
						}

						const gameData = {
							"method": "host-join",
							"playerId": playerId,
							"gameId": gameId,
							"boardState": [],
							"startCode": 777
						}


						for(let i = 0; i < total; i++){
							gameData.boardState[i] = {
								name: deck[i],
								connections: [
									{
										active: false,
										number: 0,
										state: "number"
									},{
										active: false,
										number: 0,
										state: "number"
									},{
										active: false,
										number: 0,
										state: "number"
									},{
										active: false,
										number: 0,
										state: "number"
									}
								],
								cardFlipped: false,
								moveMade: '',
							}
						}
						ws.send(JSON.stringify(gameData));




					var hostmsg = document.getElementById("host-message");
					hostmsg.parentNode.removeChild(hostmsg);

					if(!deletedNode){
						var sd1 = document.getElementById("scroll-div");
						sd1.parentNode.removeChild(sd1);
					}

					var sd3 = document.getElementById("scroll-div-3");
					sd3.parentNode.removeChild(sd3);

					var sd4 = document.getElementById("scroll-div-4");
					sd4.parentNode.removeChild(sd4);

					var subB = document.getElementById("submitBtn");
					subB.parentNode.removeChild(subB);

					var sd2 = document.getElementById("scroll-div-2");
					sd2.parentNode.removeChild(sd2);

					var bDiv = document.getElementById("button-div");
					bDiv.parentNode.removeChild(bDiv);

					var jB = document.getElementById("join-button");
					jB.parentNode.removeChild(jB);


				})


				}
			})
			//});
		}
		else{
			var jB = document.getElementById("join-button");
			jB.parentNode.removeChild(jB);

			var sd3 = document.getElementById("scroll-div-3");
			sd3.parentNode.removeChild(sd3);

			var sd4 = document.getElementById("scroll-div-4");
			sd4.parentNode.removeChild(sd4);

			var subB = document.getElementById("submitBtn");
			subB.parentNode.removeChild(subB);

			var sd2 = document.getElementById("scroll-div-2");
			sd2.parentNode.removeChild(sd2);

			var bDiv = document.getElementById("button-div");
			bDiv.parentNode.removeChild(bDiv);

			var sd1 = document.getElementById("scroll-div");
			sd1.parentNode.removeChild(sd1);



			var update = "Please wait for the host to pick cards."
			var delay = document.getElementById("host-message-output");
			var p = document.createElement('p');
			p.appendChild(document.createTextNode(update));
			delay.appendChild(p);





		}

	}
}
