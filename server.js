var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var static = require('node-static');
var dgram = require("dgram");
var file = new(static.Server)();

var connected = 0;

app.listen(8080);

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
udp_server.bind(41234);

function handler (req, res) {
	
	if (req.method == 'POST') {
		var post_body = "";
		console.log("[200] " + req.method + " to " + req.url);
	      
		req.on('data', function(chunk) {
			post_body += chunk.toString();
	    });
	    
	    req.on('end', function() {
	    	 var parsed_message = JSON.parse(post_body);
	    	 io.sockets.emit(parsed_message.type, { message: parsed_message.data });
	    	 res.writeHead(200, "OK", {'Content-Type': 'text/html'});
	    	 res.end();
	    });
	} else if (req.method == 'GET') {
		file.serve(req, res);
	} else {
		res.writeHead(405, "Method not supported", {'Content-Type': 'text/html'});
	    res.end('<html><head><title>405 - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>');
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