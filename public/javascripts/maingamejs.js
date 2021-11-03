
		//Variables (Client ID, Websocket, Button data)
		let playerId = null;
		let gameId = null;
		let clickcount = null;
		let clickcount2 = null;
		let clickcount3 = null;
		let ws = new WebSocket("ws://localhost:27000")
		const hostButton = document.getElementById("create-button");
		const joinLink = document.getElementById("divGoToJoin");
		const divGameId = document.getElementById("divGameId");
		const joinButton = document.getElementById("join-button");
		const codeJoin = document.getElementById("codeJoin");


		//button events
			hostButton.addEventListener("click", x => {

				clickcount++;
				if(clickcount == 1){

				const gameData = {
					"method": "host",
					"playerId": playerId,
					"gameId": gameId,
					"boardState": []
				}

				document.getElementById("create-game-dropdown").classList.toggle("show");

				window.onclick = function(event){
					if(!event.target.matches('#create-button')){
						var dropdowns = document.getElementsByClassName("dropdown-content");
						var i;
						for (i=0; i < dropdowns.length; i++){
							var openDropdown = dropdowns[i];
							if (openDropdown.classList.contains('show')) {
								openDropdown.classList.remove('show');
							}
						}
					}

				}

				ws.send(JSON.stringify(gameData));
				}
			})


		joinButton.addEventListener("click", x => {

			clickcount2++;
			if(clickcount2 == 1){

			document.getElementById("join-game-dropdown").classList.toggle("show");

			document.getElementById("submit-btn").addEventListener("click", c => {

				clickcount3++
				if(clickcount3 == 1){
					
					var linkId = document.getElementById("theGameId").value;
					const d = document.createElement("div");
					const a = document.createElement("a");
					const l = document.createTextNode("Join Game");
					
					document.getElementById("submit-btn").appendChild(d);
					a.appendChild(l);
					a.title = "Link to Game";
					a.href = "game/" + linkId.toUpperCase();
					codeJoin.appendChild(a);
				}
			})

			document.getElementById("join-game-dropdown").addEventListener("click", e => {
				e.stopPropagation();
			})

			window.onclick = function(event){
				if(!event.target.matches('#join-button')){
					var dropdowns = document.getElementsByClassName("dropdown-content");
					var i;
					for (i=0; i < dropdowns.length; i++){
						var openDropdown = dropdowns[i];
						if (openDropdown.classList.contains('show')) {
							openDropdown.classList.remove('show');
						}
					}
				}

			}


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
				fetch('http://localhost:27001/game', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', },
					body: JSON.stringify(gameID),
				})
				.then(response => response.json())
				.then(gameID => {
					console.log('Success: ', gameID);
				})
				.catch((error) => {
					console.error('Error:', error);
				});


				const d = document.createElement("div");
				const p = document.createElement("p");
				const b = document.createElement("button");
				const t = document.createTextNode(response.game.id);
				const a = document.createElement("a");
				const l = document.createTextNode("Join Game");

				d.textContent = "Your Game ID is: " + response.game.id + ".";

				divGameId.appendChild(d);
				divGameId.appendChild(p);

				a.appendChild(l);
				a.title = "Link to Game";
				a.href = "game/" + response.game.id;
				joinLink.appendChild(a);

			}

		}
