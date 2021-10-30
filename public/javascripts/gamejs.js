//Variables (Client ID, Websocket, Button data)
let playerId = null;
let gameId = null;
let clickcounter = null;
let ws = new WebSocket("ws://localhost:27000")
const joinButton = document.getElementById("join-button");
const theGameId = document.getElementById("theGameId");
// Live log feed lives here (Rochele)
const divChatLog = document.getElementById("divChatLog");
const divBoard = document.getElementById("divBoard");

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

var sizes = ["1x1","2x2", "3x3", "4x4", "5x5", "6x6"];





joinButton.addEventListener("click", x => {

	clickcounter++;
	if(clickcounter == 1){
		
		if (gameId === null) {
			gameId = document.getElementById('theGame').textContent;
		}
		gameId = gameId.toUpperCase();
		
		const gameData = {
			"method": "join",
			"playerId": playerId,
			"gameId": gameId
		}
		
		ws.send(JSON.stringify(gameData));
	}
});

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
			cards[i].dieState = card.dieState;
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
	