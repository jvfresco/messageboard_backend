let io

module.exports = {
    init: (httpServer, client) => {
        io = require('socket.io')(httpServer, {
            cors: {
              origin: client,
              methods: ["GET", "POST"],
            },
          })
        return io
    },
    getIO: () => {
        if (!io){
            throw new Error('Socket.io not initialized')
        }
        return io
    }
}