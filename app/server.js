const Hapi = require('@hapi/hapi')

const server = Hapi.server({
  port: process.env.PORT
})

server.route(require('./routes'))

module.exports = server
