//state machine checks boardState and keeps track on what is permittable
//and guides flow of game. *note to self* -> Think rule set in code.

//Checks dieState and executes code
function dieCheck ( boardState,  oldBoardState ) {
		//Prevents new tiles being placed on a card while it is challenged
		if ( boardState.dieState === "challenge" ){
			boardState.connections = oldBoardState.connections;
		}
}

module.exports = { dieCheck }
