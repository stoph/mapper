var app = require('http').createServer(handler),
  io = require('socket.io').listen(app),
  fs = require('fs');
var dgram = require("dgram");

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
  res.writeHead(500);
  return res.end('Nothing to see here');
}

io.configure(function () {
  io.enable('browser client minification');
  io.enable('browser client etag');
  io.enable('browser client gzip');
  io.set("origins","dev.christophkhouri.com:*");
  io.set('log level', 1);
  io.set('transports', ['websocket','flashsocket','htmlfile','xhr-polling','jsonp-polling']);
});


io.sockets.on('connection', function (socket) {
  connected++;
  var id = socket.id;
  var session = socket.manager.handshaken[id];
  //console.log(socket.manager.handshaken[id]);
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