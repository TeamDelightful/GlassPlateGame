// Compare random string to already in use ids until generates one that is unique.
exports.createId = function(inUseIds) {
    let mySet = new Set(inUseIds);
    let id = generateString();
    while (mySet.has(id)) {
        id = generateString();
    }
    return id;
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