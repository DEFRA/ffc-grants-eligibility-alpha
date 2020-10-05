describe('Home test', () => {
  const server = require('../../../../app/server')

  beforeEach(async () => {
    await server.start()
  })

  test('GET /application route with no query string returns 400', async () => {
    const options = {
      method: 'GET',
      url: '/application'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
  })

  afterEach(async () => {
    await server.stop()
  })
})
