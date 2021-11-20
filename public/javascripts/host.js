let url = "http://localhost:27001/game";
let addToGame = 1;
const joinLink = document.getElementById("divGoToJoin");
let ws = new WebSocket("ws://localhost:27000");
window.addEventListener("load", () => {
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

	var cardNames = ["ambivalence", "anthropomorphism", "art versus nature",
		"city as artifact", "coding", "contemplation", "creation", "death",
		"education", "emotional manipulation", "eternity continuity",
		"freedom", "fundamental theorem of calculus", "gestalt", "harmony",
		"helplessness", "hidden potential", "intuition", "joy", "magic",
		"metamorphosis", "monetary value",
		"multiplication of mechanical advantage", "myth",
		"nature tending towards perfection",
		"ontogeny recapitulates philogeny", "point of view perspective",
		"reaching out", "return", "society as active passive hierarchy",
		"species specific norms", "structural strength",
		"structured improvisation", "struggle", "symbolic handles",
		"synergy", "syntax", "the need not to judge",
		"unwanted relationships"];

	function printCheckBoxes(){
		var theDiv = document.getElementById("scroll-div");
		for (var i = 0; i < cardIds.length; i++) {
			var check = document.createElement("INPUT");
			check.setAttribute("type", "checkbox");
			check.id = cardIds[i];
			var label = document.createElement('label')
			label.htmlFor = cardIds[i];
			label.appendChild(document.createTextNode(cardNames[i]));
			linebreak = document.createElement("br");
			theDiv.appendChild(check);
			theDiv.appendChild(label);
			theDiv.appendChild(linebreak);
		}
	}

//	var sizes = ["1x1","2x2", "3x3", "4x4", "5x5", "6x6"];

	function printRadio(){
		var theDiv2 = document.getElementById("scroll-div-2");
		for (var i = 0; i < sizes.length; i++) {
			var radiobox = document.createElement('input');
			radiobox.type = "radio";
			radiobox.id = sizes[i];
			radiobox.name = "size";
			radiobox.value = (i+2) * (i+2);
			if(i == 1){
				radiobox.checked = true;
			}
			var label = document.createElement('label')
			label.htmlFor = sizes[i];
			label.appendChild(document.createTextNode(sizes[i]));
			linebreak = document.createElement("br");
			theDiv2.appendChild(radiobox);
			theDiv2.appendChild(label);
			theDiv2.appendChild(linebreak);
		}
	}

	function printSelectBox(){
		var theDiv4 = document.getElementById("submitBtn");
		var selButn = document.createElement("button");
		selButn.type = "button";
		selButn.innerHTML = "Submit";
		selButn.id = "submitBtn"
		theDiv4.appendChild(selButn);
	}

	var options = ["Random Deck", "Choose Deck"];

	function printOptions(){
		var theDiv3 = document.getElementById("scroll-div-3");
		for (var i = 0; i < options.length; i++) {
			var radiobox = document.createElement('input');
			radiobox.type = "radio";
			radiobox.id = options[i];
			radiobox.name = "options";
			radiobox.value = options[i];
			if(i == 0){
				radiobox.checked = true;
			}
			var label = document.createElement('label')
			label.htmlFor = options[i];
			label.appendChild(document.createTextNode(options[i]));
			linebreak = document.createElement("br");
			theDiv3.appendChild(radiobox);
			theDiv3.appendChild(label);
			theDiv3.appendChild(linebreak);
		}
	}

	printOptions();
	printSelectBox();

	//Select button code
	const selectButton = document.getElementById("submitBtn");
	const selectDiv = document.getElementById("scroll-div-3");
	selectButton.addEventListener("click", x => {
		var optionSelected = options[0];
		for (var i = 0; i < options.length; i++) {
			var optionStatus = document.getElementById(options[i]);
			if(optionStatus.checked){
				optionSelected = optionStatus.value;
			}
		}
		if(optionSelected == options[0]){
			selectButton.style.display = "none";
			selectDiv.style.display = "none";
			printRadio();
			var theBDiv = document.getElementById("button-div");
			var button = document.createElement('button');
			button.type = "button";
			button.className = "all-home-buttons start1";
			button.id = "start-game";
			button.ariaLabel = "start game button";
			button.innerHTML = "start game";
			theBDiv.appendChild(button);
			var sd1 = document.getElementById("scroll-div");
			sd1.parentNode.removeChild(sd1);
		}
		if(optionSelected == options[1]){
			printCheckBoxes();
			var theBDiv = document.getElementById("button-div");
			var button = document.createElement('button');
			button.type = "button";
			button.className = "all-home-buttons start2";
			button.id = "start-game";
			button.ariaLabel = "start game button";
			button.innerHTML = "start game";
			theBDiv.appendChild(button);
		}
		//button events
		const hostButton = document.getElementById("start-game");
		hostButton.addEventListener("click", x => {
			if(optionSelected == options[1]){
				for (var i = 0; i < cardIds.length; i++) {
					var idstatus = document.getElementById(cardIds[i]);
					if(idstatus.checked){
						cardSelected.push(cardIds[i]);
					}
				}
			} 
			else {
				cardSelected = cardIds;
			}
			if(cardSelected.length <= 1){
				cardSelected = [];
				return;
			}
			var total = 4;
			if(optionSelected == options[0]){
				for (var i = 0; i < sizes.length; i++) {
					var sizeStatus = document.getElementById(sizes[i]);
					if(sizeStatus.checked){
						total = sizeStatus.value;
					}
				}
			} 
			else {
				total = cardSelected.length;
			}
			var deck = [];
			var max = cardSelected.length;
			if(total == max){
				deck = cardSelected;
			} 
			else {
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
                "boardState": [],
			}
						
			for(let i = 0; i < total; i++) {
				gameData.boardState[i] = {
					name: deck[i],
					connections: [
					{
						active: false,
						number: 0,
						state: "number"
					},{
						active: false,
						number: 0,
						state: "number"
					},{
						active: false,
						number: 0,
						state: "number"
					},{
						active: false,
						number: 0,
						state: "number"
					}
					],
					cardFlipped: false,
					moveMade: '',
				}
			}
			ws.send(JSON.stringify(gameData));
		});
	});
});

//Websocket communication
ws.onmessage = message => {
	//message data JSON
	const response = JSON.parse(message.data);
	
	if(response.method === "startGame"){
		const gameId = response.id;
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

		setTimeout(() => {window.location.href = '/game/' + gameId}, 1);
	}	
}