//state machine checks boardState and keeps track on what is permittable
//and guides flow of game. *note to self* -> Think rule set in code.

//Checks dieState and executes code
function dieCheck ( boardState,  oldBoardState ) {
		//Prevents new tiles being placed on a card while it is challenged
		challengeOnOldBoard = false;
		oldBoardState.forEach((card, i) => {
			card.connections.forEach((connection, i) => {
				if(connection.state == 'challenge'){
					challengeOnOldBoard = true;
				}
			});
		});

		challengeOnNewBoard = false;
		boardState.forEach((card, i) => {
			card.connections.forEach((connection, i) => {
				if(connection.state == 'challenge'){
					challengeOnNewBoard = true;
				}
			});
		});

		if(challengeOnOldBoard && challengeOnNewBoard){
			boardState.forEach((card, i) => {
				card.connections = oldBoardState[i].connections;
			});
		}
}

module.exports = { dieCheck }
