const { response } = require("express");

function downloadLog(log) {
    let logString = "~ GAME RECORD FOR THE GLASS PLATE GAME ~"; 
	log.forEach(p => {logString = logString + '\n' + p});
    // Start file download.
    let download = document.createElement('a');
    download.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(logString));
    download.setAttribute('download', "gameLog.txt");
    download.style.display = 'none';
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
}