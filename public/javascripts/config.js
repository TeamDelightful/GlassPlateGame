const ipSettings = {
	IP: "linux.cs.pdx.edu",
	httpPort: 27000,
	expressPort: 27001
};

try{
	module.exports = { ipSettings };
}catch{
	console.log('Client side loaded');
};
