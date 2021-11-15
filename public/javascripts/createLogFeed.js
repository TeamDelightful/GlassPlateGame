function createLogFeed(chatLog) {
    // Create log/chat feed
    let chatDiv = document.createElement('div');
    chatDiv.id = 'chat';
    let messageDiv = document.createElement('div');
    messageDiv.id = "chat-messages";
    chatDiv.appendChild(messageDiv);
    let form = document.createElement('div');
    form.id="chat-form";
    let input = document.createElement('input');
    input.style.marginBottom = 0;
    input.id = 'chatInput';
    input.type = 'text';
    input.placeholder="Enter a message...";
    input.maxlength="500";
    input.autocomplete="off";
    form.appendChild(input);
    let formBut = document.createElement('button');
    formBut.type = "submit";
    formBut.id = 'formButton'
    formBut.textContent = 'Send';
    formBut.addEventListener("click", x => {
        let chatMessage = document.getElementById('chatInput').value;
        if(chatMessage === '')
            return;
        const gameData = {
            "method": "chat",
            "gameId": gameId,
            "playerId": playerId,
            "chatMessage": chatMessage
        }
        document.getElementById('chatInput').value = null;
        ws.send(JSON.stringify(gameData));
    })
    form.appendChild(formBut);
    chatDiv.appendChild(form);
    divChatLog.appendChild(chatDiv);

    // Create download log button
    const downloadButton = document.createElement("button");
    downloadButton.id = "download";
    downloadButton.appendChild(document.createTextNode('Download Game Log'));
    downloadButton.setAttribute("style", "position: relative; left: 20px;");
    downloadButton.addEventListener("click", x => {
        if (confirm("Would you like to download and save a copy of this game?")) {
            // Get game data
            const gameData = {
                "method": "download",
                "playerId": playerId,
                "gameId": gameId,
            }
            ws.send(JSON.stringify(gameData));
        }
        else {
            return;
        }
    })
    divChatLog.appendChild(downloadButton);
    loadCurrentLog(chatLog);
}

// Function to load current log into chat feed
function loadCurrentLog(chatLog) {
    chatLog.forEach(element => {
        let chatMessage = document.createElement('p');
		chatMessage.textContent = element;
		document.getElementById('chat-messages').appendChild(chatMessage);
		const messageDiv = document.getElementById('chat-messages');
    });
};