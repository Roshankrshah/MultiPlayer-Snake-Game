const { Server } = require('socket.io');
const { createGameState, gameLoop, getUpdatedVelocity} = require('./game');
const {FRAME_RATE}=require('./constants');

const io = new Server({
    cors:{
        origin: '*'
    }
});

io.on('connection',client => {
    const state = createGameState();

    client.on('keydown',handleKeydown);

    function handleKeydown(keyCode){
        try {
            keyCode = parseInt(keyCode);

        } catch (error) {
            console.log(error);
            return;
        }

        const vel = getUpdatedVelocity(keyCode);

        if(vel){
            state.player.vel = vel;
        }
    }

    startGameInterval(client,state);
});

function startGameInterval(client,state){
    const intervalId = setInterval(() => {
        const winner = gameLoop(state);
        if(!winner){
            client.emit('gameState',JSON.stringify(state));
        }else{
            client.emit('gameOver');
            clearInterval(intervalId);
        }
    }, 1000/FRAME_RATE);
}

io.listen(3000);