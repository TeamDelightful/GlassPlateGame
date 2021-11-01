//Variables (Client ID, Websocket, Button data)
let playerId = null;
let gameId = null;
let ws = new WebSocket("ws://localhost:27000")
const joinButton = document.getElementById("join-button");
const theGameId = document.getElementById("theGameId");
// Live log feed lives here (Rochele)
const divChatLog = document.getElementById("divChatLog");
const divBoard = document.getElementById("divBoard");

joinButton.addEventListener("click", x => {

	if (gameId === null) {
		gameId = theGameId.value;
	}
	gameId = gameId.toUpperCase();

	const gameData = {
		"method": "join",
		"playerId": playerId,
		"gameId": gameId
    }

	ws.send(JSON.stringify(gameData));

})

//Websocket communication
ws.onmessage = message => {
	//message data JSON
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
		});

	}

	// Update live log/chat (Rochele)
	if(response.method === 'updateChat') {
		let chatMessage = document.createElement('p');
		chatMessage.textContent = response.chatMessage;
		document.getElementById('chat-messages').appendChild(chatMessage);
		const messageDiv = document.getElementById('chat-messages');
		let xH = messageDiv.scrollHeight;
		messageDiv.scrollTo(0, xH);
	}

	// Create file with game data and download to local machine (Rochele)
	if(response.method === 'download') {
		downloadLog(response.chatLog);
	}

	//join game
	if (response.method === "join") {
		// Call function to create log/chat feed and add join message (Rochele)
		createLogFeed(response.chatLog);

		pixiStart(response.boardState);
	}
}
