const ipSettings = {
	IP: "127.0.0.1",
	httpPort: 9080,
	expressPort: 9081
};

try{
	module.exports = { ipSettings };
}catch{
	console.log('Client side loaded');
};
