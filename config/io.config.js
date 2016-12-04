const socketio = require('socket.io');

const users = [];
const connections = [];

module.exports.listen = function(app){
        io = socketio.listen(app);
        
        io.sockets.on('connection', function(socket) {
            connections.push(socket);
            console.log('Connected: %s sockets connnected', connections.length);

            // Disconnect
            socket.on('disconnect', function(data) {
                users.splice(users.indexOf(socket.username), 1);
                updateUsernames();
                connections.splice(connections.indexOf(socket), 1);
                console.log('Disconnected %s sockets connected', connections.length);
            });

            // Send Message
            socket.on('send message', function(data) {
                io.sockets.emit('new message', { msg: data, user: socket.username });
            });

                // New User 
            socket.on('new user', function(data, callback) {
                callback(true);
                socket.username = data;
                users.push(socket.username);
                updateUsernames();
            });

            function updateUsernames() {
                io.sockets.emit('get users', users);
            }

            return io;
        });        
}