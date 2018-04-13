// Simple TCP Scoket Server

const net = require('net');
const server = net.createServer();
const PORT = 7070;
const HOST = '127.0.0.1';

const max_num_of_messages = 3;

const continue_cmd = JSON.stringify({"cmd": "continue"});
const exit_cmd = JSON.stringify({"cmd": "exit"});

let message_cache = new Map();

server.listen(PORT, HOST, () => {
    console.log('TCP Server is running on port ' + PORT);
});

server.on('connection', function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

    message_cache.set(sock.remoteAddress, []);
    
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        // Convert ByteBuffer to UTF-8 String
        let str_data = data.toString('utf8');
        let json_message = JSON.parse(str_data);
        let message_bus = message_cache.get(sock.remoteAddress);
        
        console.log('Received data from ' + sock.remoteAddress + ': ' + str_data);
        
        message_bus.push(json_message.message);
        
        if (message_bus.length >= 3) {
            sock.write(exit_cmd, 'utf8');
        } else {
            sock.write(continue_cmd, 'utf8');
        }
    });
    
    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
        
        message_bus = message_cache.get(sock.remoteAddress);
        console.log("All the messages received from '" + sock.remoteAddress + "' are " + message_bus.toString());
        
        message_cache.delete(sock.remoteAddress);
    });
});