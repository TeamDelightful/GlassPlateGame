const ipSettings = {
	//IP: "linux.cs.pdx.edu",
	IP: "127.0.0.1",
	httpPort: 27000,
	expressPort: 27001
};

try{
	module.exports = { ipSettings };
}catch{
	console.log('Client side loaded');
};
