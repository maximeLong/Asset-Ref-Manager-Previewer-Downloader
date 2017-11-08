import feathers from 'feathers/client'
import hooks from 'feathers-hooks'
import socketio from 'feathers-socketio/client'
import auth from 'feathers-authentication-client'
import io from 'socket.io-client'

const socket = io(process.env.SERVER_ADDRESS, {transports: ['websocket']})

const server = feathers()
  .configure(hooks())
  .configure(socketio(socket))
  .configure(auth({ storage: window.localStorage }))

server.service('/users')
server.service('/teams')

server.service('/scenes')
server.service('/variants')
server.service('/assets')

export default server