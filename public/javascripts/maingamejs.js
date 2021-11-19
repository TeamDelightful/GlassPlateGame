
		//Variables (Client ID, Websocket, Button data)
		let url = "http://localhost:27001/game";
		let playerId = null;
		let gameId = null;
		let clickcount = null;
		let clickcount2 = null;
		let clickcount3 = null;
		let addToGame = 1;
		let ws = new WebSocket("ws://localhost:27000")
		const hostButton = document.getElementById("create-button");
		const joinLink = document.getElementById("divGoToJoin");
		const divGameId = document.getElementById("divGameId");
		const joinButton = document.getElementById("join-button");
		const codeJoin = document.getElementById("codeJoin");


		//button events
			hostButton.addEventListener("click", x => {

				const gameData = {
					"method": "host",
					"playerId": playerId,
					"gameId": gameId,
					"boardState": []
				}
				ws.send(JSON.stringify(gameData));			
			})


		joinButton.addEventListener("click", x => {

			clickcount2++;
			if(clickcount2 == 1){

				document.getElementById("join-game-dropdown").classList.toggle("show");

				document.getElementById("submit-btn").addEventListener("click", c => {

					clickcount3++
					if(clickcount3 == 1){
						
						var linkId = document.getElementById("theGameId").value;
						if(linkId !== ""){
							window.location.href = "game/" + linkId.toUpperCase();
						}
					}
				})
			}
		})


		//Websocket communication
		ws.onmessage = message => {
			//message data JSON
			const response = JSON.parse(message.data);

			//host game
			if (response.method === "host") {

				const game = response.game;
				gameId = response.game.id;

				const gameID = { gameID: gameId };

					fetch(url, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json',},
						body: JSON.stringify({gameID, "addDelete":addToGame}),
					})
					.then(response => response.json())
					.then(gameID => {
						console.log('Success: ', gameID);
					})
					.catch((error) => {
						console.error('Error:', error);
					});
				window.location.href = "game/" + gameId;

			}

		}