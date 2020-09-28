const server = require('./server')

const init = async () => {
  await server.start()
  console.log(`# Hapi server started successfully on ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
