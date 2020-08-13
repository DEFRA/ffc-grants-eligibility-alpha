const Hapi = require('@hapi/hapi')

const server = Hapi.server({
  port: process.env.PORT
})

server.route({
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return 'Hello from Grants Eligibility Test'
  }
})

module.exports = server
