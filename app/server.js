const Hapi = require('@hapi/hapi')
const models = require('./models')

async function showApps (application) {
  const apps = await application.findAll()
  console.log('All apps: ', JSON.stringify(apps, null, 2))
}

showApps(models.Application)

const server = Hapi.server({
  port: process.env.PORT
})

module.exports = server
