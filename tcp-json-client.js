// Simple TCP Socket Client
const net = require('net');
const PORT = 7070;
const HOST = '127.0.0.1';

const client = new net.Socket();

client.connect(PORT, HOST, function() {
    console.log('Connected');
    client.write(JSON.stringify({"message": "hello from client"}));
});
client.on('data', function(data) {
    let str_data = data.toString('utf8');
    let server_cmd = JSON.parse(str_data);
    
    console.log('received data from server : ' + str_data);
    
    if (server_cmd.cmd === 'exit') {
        client.destroy();
    }
});
client.on('close', function() {
    console.log('Connection closed');
});