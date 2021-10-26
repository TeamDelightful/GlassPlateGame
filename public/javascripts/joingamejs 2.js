
		//Variables (Client ID, Websocket, Button data)
		let playerId = null;
		let gameId = null;
		let ws = new WebSocket("ws://localhost:9090")
		const joinButton = document.getElementById("join-button");
		const theGameId = document.getElementById("theGameId");
		//Shows player number in game
		const divPlayers = document.getElementById("divPlayers");
		const divBoard = document.getElementById("divBoard");
		
		joinButton.addEventListener("click", x => {
			
			if (gameId === null){
				gameId = theGameId.value;
			}
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
				if (!response.game.state) return;
				
				for (const b of Object.keys(response.game.state)){
					const color = response.game.state[b];
					const cardObject = document.getElementById("card" + b);
					cardObject.style.backgroundColor = color
				}
			}
			
			//join game
			if (response.method === "join") {
				
				const game = response.game;
				
				while(divPlayers.firstChild) {
					divPlayers.removeChild(divPlayers.firstChild)
				}
				
				game.players.forEach( p => {
					const d = document.createElement("div");
					d.style.width = "200px";
					d.textContent = "Player ID: " + p.playerId + " has joined.";
					divPlayers.appendChild(d)
				})
				
				while(divBoard.firstChild) {
					divBoard.removeChild(divBoard.firstChild)
				}
				
				for ( let i = 0; i < game.cards; ++i){
					const card = document.createElement("button");
					card.id = "card" + (i + 1);
					card.tag = i+1
					//card.textContent = game.boardState[i][0]
					card.style.width = "200px";
					card.style.height = "200px";
					card.style.backgroundImage = "url('../images/4x4x150cards/education.png')" ;
					//flips card color
					card.addEventListener("click", x => {
					//	if(card.style.backgroundColor == "transparent")
					//		card.style.backgroundColor = "";
					//	else
					//		card.style.backgroundColor = "transparent";
						
						const gameData = {
							"method": "play",
							"playerId": playerId,
							"gameId": gameId,
							"cardId": card.tag,
							"color": card.style.backgroundColor,
						}
						
						ws.send(JSON.stringify(gameData));
					})
					divBoard.appendChild(card);
				}
				// Create and add Download button to bottom of board (Rochele)
				const downloadButton = document.createElement("button");
				downloadButton.id = "download";
				downloadButton.appendChild(document.createTextNode('Download Game Log'));
				downloadButton.addEventListener("click", x => {
					if (confirm("Would you like to download and save a copy of this game?")) {
						// Get game data
						const gameData = {
							"method": "download",
							"playerId": playerId,
							"gameId": gameId,
						}
						ws.send(JSON.stringify(gameData));
					} 
					else {
						return;
					}
				})
				divBoard.appendChild(downloadButton);
			}
			// Create file with game data and download to local machine (Rochele)
			if(response.method === 'download') {
				let jsonString = JSON.stringify(response.game);
				// Start file download.
				var element = document.createElement('a');
				element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonString));
				element.setAttribute('download', "gameLog.txt");
				element.style.display = 'none';
				document.body.appendChild(element);
				element.click();
				document.body.removeChild(element);			
			}
		}
		
