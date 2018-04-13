// Simple TCP Scoket Server

const net = require('net');
const server = net.createServer();
const PORT = 7070;
const HOST = '127.0.0.1';

const exit_cmd = JSON.stringify({"cmd": "exit"});

server.listen(PORT, HOST, () => {
    console.log('TCP Server is running on port ' + PORT);
});

server.on('connection', function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        // Convert ByteBuffer to UTF-8 String
        let str_data = data.toString('utf8');
        console.log('Received data from ' + sock.remoteAddress + ': ' + str_data);
        
        sock.write(exit_cmd, 'utf8');
    });
    
    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
});