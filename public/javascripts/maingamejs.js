//Variables (Client ID, Websocket, Button data)
let url = "http://"+ ipSettings.IP + ":"+ ipSettings.expressPort + "/game";
let playerId = null;
let gameId = null;
let addToGame = 1;
let ws = new WebSocket("ws://"+ ipSettings.IP +":"+ ipSettings.httpPort);
const hostButton = document.getElementById("create-button");
const joinLink = document.getElementById("divGoToJoin");
const divGameId = document.getElementById("divGameId");
const joinButton = document.getElementById("join-button");
const codeJoin = document.getElementById("codeJoin");

//button events
hostButton.addEventListener("click", x => {
	window.location.href = '/game';
})

joinButton.addEventListener("click", x => {
	document.getElementById("join-game-dropdown").classList.toggle("show");
	document.getElementById("submit-btn").addEventListener("click", c => {
		var linkId = document.getElementById("theGameId").value;
		if(linkId !== ""){
			window.location.href = "game/" + linkId.toUpperCase();
		}
	})
})

