const { Server } = require('socket.io');

const io = new Server();

io.on('connection',client => {
    client.emit('init',{data: 'hello world'});
});

io.listen(3000);