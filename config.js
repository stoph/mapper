exports.config = {
    server_opts: {
        sockjs_url: 'http://cdn.sockjs.org/sockjs-0.3.min.js',
        websocket: true
    },
    udp: {
    	port: 41234
    },
    tcp: {
    	port: 8080
    },
    host: '0.0.0.0'
};