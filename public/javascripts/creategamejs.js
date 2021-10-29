
		//Variables (Client ID, Websocket, Button data)
		let playerId = null;
		let gameId = null;
		let ws = new WebSocket("ws://localhost:27000")
		const hostButton = document.getElementById("create-button");
		//Shows Game number in game
		const divGameId = document.getElementById("divGameId");
		const divShareId = document.getElementById("divShareId");

		var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

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

		//button events
		hostButton.addEventListener("click", x => {

			for (var i = 0; i < cardIds.length; i++) {
				var idstatus = document.getElementById(cardIds[i]);
				if(idstatus.checked){
					cardSelected.push(cardIds[i]);
				}
			}
			var total = 4;
			var deck = [];
			var max = cardSelected.length;
			if(total == max){
				deck = cardSelected;
			} else {
				for(let i = 0; i < total; i++){
					temp = Math.floor(Math.random() * max) + 1;
					while(deck.includes(temp)){
						temp = Math.floor(Math.random() * max) + 1;
					}
					deck[i] = cardSelected[temp];
				}
			}

			const gameData = {
				"method": "host",
				"playerId": playerId,
				"gameId": gameId,
				"boardState": [
						{
								name: deck[0],
								connections: [false,false,false,false],
								dieState: "blank",
								cardFlipped: false,
						},
						{
								name: deck[1],
								connections: [false,false,false,false],
								dieState: "blank",
								cardFlipped: false,
						},
						{
								name: deck[2],
								connections: [false,false,false,false],
								dieState: "blank",
								cardFlipped: false,
						},
						{
								name: deck[3],
								connections: [false,false,false,false],
								dieState: "blank",
								cardFlipped: false,
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
