let url = "http://localhost:27001/game";

//****** MAKE SURE TO GET THE GAME NUM PASSED IN FIRST FROM response ******
const gameNum = response.id;

const gameID = { gameID: gameNum };
let addToGame = 99;

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
