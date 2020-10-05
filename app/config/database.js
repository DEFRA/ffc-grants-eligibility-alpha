const auth = require('@azure/ms-rest-nodeauth')

const hooks = {
  beforeConnect: async cfg => {
    console.log('running beforeConnect hook')
    if (process.env.NODE_ENV === 'production') {
      console.log('attempting to acquire MSI credentials')
      const credentials = await auth.loginWithVmMSI({ resource: 'https://ossrdbms-aad.database.windows.net' })
      console.log('credentials acquired')
      const token = await credentials.getToken()
      console.log('token acquired')
      cfg.password = token.accessToken
    }
  }
}

const retry = {
  backoffBase: 500,
  backoffExponent: 1.1,
  match: [/SequelizeConnectionError/],
  max: 10,
  name: 'connection',
  report: message => { console.log(message) },
  timeout: 60000
}

module.exports = {
  hooks,
  retry,
  dialect: 'postgres',
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  schema: process.env.POSTGRES_SCHEMA_NAME,
  username: process.env.POSTGRES_USER
}
