// Compare random string to already in use ids until generates one that is unique.
exports.createGameId = function(aSet) {
    let mySet = new Set(aSet);
    let gameId = generateString();
    while (mySet.has(gameId)) {
        gameId = generateString();
    }
    return gameId;
};

// Generate a string of five random characters
generateString = function() {
    const chars ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let string = '';
    for ( let i = 0; i < 5; i++ ) {
        string += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return string;
};