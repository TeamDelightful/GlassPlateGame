
		//Variables (Client ID, Websocket, Button data)
		let playerId = null;
		let gameId = null;
		let ws = new WebSocket("ws://localhost:27000")
		const hostButton = document.getElementById("create-button");
		//Shows Game number in game
		const divGameId = document.getElementById("divGameId");
		const divShareId = document.getElementById("divShareId");

		var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

		//button events
		hostButton.addEventListener("click", x => {

			const gameData = {
				"method": "host",
				"playerId": playerId,
				"gameId": gameId,
				"boardState": [
						{
								name: "ambivalence",
								connections: [false,false,false,false],
								dieState: "blank",
						},
						{
								name: "anthropomorphism",
								connections: [false,false,false,false],
								dieState: "blank",
						},
						{
								name: "art_versus_nature",
								connections: [false,false,false,false],
								dieState: "blank",
						},
						{
								name: "city_as_artifact",
								connections: [false,false,false,false],
								dieState: "blank",
						}
				]
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
				const b = document.createElement("button");
				const t = document.createTextNode(response.game.id);
				
				const goToJoinButton = document.createElement("button");
				goToJoinButton.classList.add('all-home-buttons');
				goToJoinButton.classList.add('gotojoin-button');
				
				
				d.style.width = "200px";
				d.textContent = "Your Game ID is: " + response.game.id + ".";
				goToJoinButton.textContent = "go to join";
				
				divGameId.appendChild(d);
				divGameId.appendChild(p);
				divGoToJoin.appendChild(goToJoinButton);
				
				if(!isChrome){
					b.textContent = "Copy ID to clipboard";
					divShareId.appendChild(b);
					divShareId.appendChild(p);
					
					document.getElementById("divShareId").onclick = function () {
						var copyText = gameId;
						navigator.clipboard.writeText(copyText);
						alert("Copied the ID code: " + copyText);
					};
				}
				
				document.getElementById("divGoToJoin").onclick = function () {
					location.href = "/joingame";
				};
			}
		}
