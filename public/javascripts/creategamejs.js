
		//Variables (Client ID, Websocket, Button data)
		let playerId = null;
		let gameId = null;
		let ws = new WebSocket("ws://localhost:27000")
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

		var sizes = ["1x1","2x2", "3x3", "4x4", "5x5", "6x6"];

		//Select button code
		const selectButton = document.getElementById("select-button");
		selectButton.addEventListener("click", x => {
			var optionSelected = options[0];
			for (var i = 0; i < options.length; i++) {
				var optionStatus = document.getElementById(options[i]);
				if(optionStatus.checked){
					optionSelected = optionStatus.value;
				}
			}
			if(optionSelected == options[0]){
				printRadio();
				var theBDiv = document.getElementById("button-div");
				var button = document.createElement('input');
				button.type = "button";
				button.class = "all-home-buttons";
				button.id = "create-button";
				button.ariaLabel = "create game button";
				button.value = "Create Game"
				theBDiv.appendChild(button);
			}
			if(optionSelected == options[1]){
				printCheckBoxes();
				var theBDiv = document.getElementById("button-div");
				var button = document.createElement('input');
				button.type = "button";
				button.class = "all-home-buttons";
				button.id = "create-button";
				button.ariaLabel = "create game button";
				button.value = "Create Game"
				theBDiv.appendChild(button);
				
			}
			//button events
			const hostButton = document.getElementById("create-button");
			hostButton.addEventListener("click", x => {
				if(optionSelected == options[1]){
					for (var i = 0; i < cardIds.length; i++) {
						var idstatus = document.getElementById(cardIds[i]);
						if(idstatus.checked){
							cardSelected.push(cardIds[i]);
						}
					}
				} else {
					cardSelected = cardIds;
				}
				var total = 4;
				if(optionSelected == options[0]){
					for (var i = 0; i < sizes.length; i++) {
						var sizeStatus = document.getElementById(sizes[i]);
						if(sizeStatus.checked){
							total = sizeStatus.value;
						}
					} 
				} else {
					total = cardSelected.length;
					}
				var deck = [];
				var max = cardSelected.length;
				if(total == max){
					deck = cardSelected;
				} else {
					for(let i = 0; i < total; i++){
						temp = Math.floor(Math.random() * max);
						while(deck.includes(cardSelected[temp])){
							temp = Math.floor(Math.random() * max);
						}
						deck[i] = cardSelected[temp];
					}
				}

				const gameData = {
					"method": "host",
					"playerId": playerId,
					"gameId": gameId,
					"boardState": []
				}
				for(let i = 0; i < total; i++){
					gameData.boardState[i] = {
						name: deck[i],
						connections: [false,false,false,false],
						dieState: "blank",
						cardFlipped: false,
					}
				}


				ws.send(JSON.stringify(gameData));

			})
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
