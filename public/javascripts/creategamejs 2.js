
		//Variables (Client ID, Websocket, Button data)
		let playerId = null;
		let gameId = null;
		let ws = new WebSocket("ws://localhost:9090")
		const hostButton = document.getElementById("create-button");
		//Shows Game number in game
		const divGameId = document.getElementById("divGameId");
		
		//button events
		hostButton.addEventListener("click", x => {
			
			const gameData = {
				"method": "host",
				"playerId": playerId,
				"gameId": gameId
			}

			ws.send(JSON.stringify(gameData));
			
		})
		
		//Websocket communication
		ws.onmessage = message => {
			//message data JSON
			const response = JSON.parse(message.data);
			
			//host game
			if (response.method === "host") {

				const game = response.game;
				gameId = response.game.id;
			
				const d = document.createElement("div");
				const p = document.createElement("p");
				d.style.width = "200px";
				d.textContent = "Your Game ID is: " + response.game.id + ".";
				divGameId.appendChild(p);
				divGameId.appendChild(d);
		
			}
		}
			
