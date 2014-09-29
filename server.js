var config = require('./config').config;

var argv = require('optimist').argv;
var dgram = require("dgram");
var io = require('socket.io')(config.ws.port);
var redis = require('socket.io-redis');

var faker = require('./faker');
var generate_fake_data=argv.fake;

var connected = 0;

// Setup Redis transport layer
io.adapter(redis({ host: config.redis.host, port: config.redis.port }));

// Set up the UDP listener
var udp_server = dgram.createSocket("udp4");

// On startup
udp_server.on("listening", function () {
	var address = udp_server.address();
	console.log("udp_server listening " + address.address + ":" + address.port);
});

// Listen for messages and rebroadcast via WebSockets
udp_server.on("message", function (message, rinfo) {
	console.log("server got: " + message + " from " + rinfo.address + ":" + rinfo.port);
	var parsed_message = JSON.parse(message);
	if (parsed_message.type) {
		var _channel = "/"
		if (parsed_message.channel) {
			_channel = parsed_message.channel;
		}
		var channel = parsed_message.type+":"+_channel;
		//console.log("Posting to channel: "+channel);
		io.emit(channel, parsed_message.data );
	} else {
		console.log("No type");
	}
});

// Bind to port
udp_server.bind(config.udp.port);

// Handle initial websocket connection events
io.on('connection', function (socket) {
	connected++;
	var id = socket.id;
	console.log(id + " connected - " + connected + " connected clients");

	io.emit('connected', { num: connected });

	socket.on('disconnect', function (socket) {
		connected--;
		console.log(id + " disconnected - " + connected + " connected clients");

		io.emit('connected', { num: connected });
	});
});

console.log("Node map server running");

if (generate_fake_data) {
	console.log("Generating fake data");
	setInterval(function(){
		var fake = faker.generate();
		var message = {"site_id":fake.site_id, "post_id":fake.post_id, "image":fake.image, "geo":{"lat":fake.lat,"long":fake.long}};
		io.emit("serve:/", message );
		process.stdout.write('.');
	},500);


}




