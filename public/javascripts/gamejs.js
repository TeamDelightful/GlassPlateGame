//Variables (Client ID, Websocket, Button data)
let url = "http://"+ ipSettings.IP + ":"+ ipSettings.expressPort + "/game";
let playerId = null;
let gameId = document.getElementById('theGame').textContent;
let ws = new WebSocket("ws://"+ ipSettings.IP +":"+ ipSettings.httpPort);


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
	document.getElementById('join-button').style.display = "none";	
	let usernameDiv = document.getElementById('divEnterUsername');
	usernameDiv.style.display = "none";
	let displayId = document.getElementById('displayId');
	displayId.style.display = "block";	
	const gameData = {
		"method": "join",
		"playerId": playerId,
		"username": username,
		"gameId": gameId,
	}
	ws.send(JSON.stringify(gameData));
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
	if (response.method === "join"){
		console.log('game should load here');
		
		let leaveButton = document.getElementById('leave-button');
		leaveButton.style.display = "block";
		
		createLogFeed(response.chatLog);
		
		pixiStart(response.boardState);
	}
} 


