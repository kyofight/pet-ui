const project = require('../config/project.config')
const app = require('../server/main')
const debug = require('debug')('app:bin:dev-server')

const server = require('http').Server(app)


/**
 * todo: socket cluster implementation
 */

/**
const io = require('socket.io')(server)
const ioClient = require('socket.io-client')

io.on('connection', socket => {
  console.log(`new socketio connection ${socket.id}`)
  socket.on('disconnect', () => {
    console.log(`socketio connection ${socket.id} is disconnected`)
  })
})

const socketClient = ioClient(project.server_api)
socketClient.on('pet.new', function(event) {
  io.emit('pet.new', {
    payload: event.payload
  })
})
 **/

server.listen(project.server_port, () => {
  debug(`Server is now running at http://localhost:${project.server_port}.`)
  console.log(`Server is now running at http://localhost:${project.server_port}.`)
})
