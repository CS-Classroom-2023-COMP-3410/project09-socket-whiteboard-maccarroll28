const http = require('http');
const socketIo = require('socket.io');

// Create an HTTP server
const server = http.createServer();
const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// Maintain the board state
let boardState = [];

// Listen for incoming client connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send full board state to new clients
    socket.emit('boardState', boardState);

    // Listen for drawing actions and broadcast them
    socket.on('draw', (data) => {
        boardState.push(data);
        io.emit('draw', data);
    });    

    // Handle board clear event
    socket.on('clearBoard', () => {
        boardState = [];
        io.emit('clearBoard');
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
