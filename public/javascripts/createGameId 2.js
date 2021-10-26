// Create random string for 5 char room code
exports.createGameId = function(aSet) {
    // declare all usable characters
    let mySet = new Set(aSet);
    console.log(mySet);
    let gameId = generateString();
    while (mySet.has(gameId)) {
        gameId = generateString();
    }
    return gameId;
};

generateString = function() {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for ( let i = 0; i < 5; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};