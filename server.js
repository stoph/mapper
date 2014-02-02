var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var static = require('node-static');
var dgram = require("dgram");
var argv = require('optimist').argv;
var config = require('./config').config;
var fake = require('./fake');

var generate_fake_data=argv.fake;
var file = new(static.Server)();

var connected = 0;

app.listen(config.tcp.port);

var udp_server = dgram.createSocket("udp4");
udp_server.on("message", function (message, rinfo) {
	//console.log("server got: " + message + " from " + rinfo.address + ":" + rinfo.port);
	var parsed_message = JSON.parse(message);
	io.sockets.emit(parsed_message.type, { message: parsed_message.data });
});
udp_server.on("listening", function () {
	var address = udp_server.address();
	console.log("udp_server listening " + address.address + ":" + address.port);
});
udp_server.bind(config.udp.port);

function handler (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token');
	res.setHeader('Access-Control-Max-Age', 3600);

	console.log("Got a "+req.method);
	if (req.method == 'POST') {
		var post_body = "";

		req.on('data', function(chunk) {
			post_body += chunk.toString();
		});

		req.on('end', function() {
			console.log(post_body);
			 var parsed_message = JSON.parse(post_body);
			 io.sockets.emit(parsed_message.type, { message: parsed_message.data });
			 res.writeHead(200, "OK", {'Content-Type': 'text/html'});
			 res.end();
		});
	} else if (req.method == 'GET') {
		file.serve(req, res);
	} else if (req.method == 'OPTIONS') {
		res.writeHead(200, "OK");
		res.end();
	} else {
		res.writeHead(405, "Method not supported", {'Content-Type': 'text/html'});
		res.end();
	}
}

io.configure(function () {
	io.enable('browser client minification');
	io.enable('browser client etag');
	io.enable('browser client gzip');
	io.set("origins","*:*");
	io.set('log level', 1);
	io.set('transports', ['websocket','flashsocket','htmlfile','xhr-polling','jsonp-polling']);
});

io.sockets.on('connection', function (socket) {
	connected++;
	var id = socket.id;
	var session = socket.manager.handshaken[id];
	console.log(session.headers.referer);
	console.log(id + " connected - " + connected + " connected clients");

	io.sockets.emit('clients', { clients: connected });

	socket.on('disconnect', function (socket) {
		connected--;
		console.log();
		console.log(id + " disconnected - " + connected + " connected clients");

		io.sockets.emit('clients', { clients: connected });
	});
});

console.log("Node map server running");

if (generate_fake_data) {

	setInterval(function(){
		var location = fake.randomGeo();
		var message = {"type":"serve","data":{"id":location.id,"geo":{"latitude":location.lat,"longitude":location.long}}}
		io.sockets.emit(message.type, { message: message.data });
		//console.log(message);
	},50);


}




