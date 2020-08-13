describe('Server test', () => {
  test('createServer returns server', async () => {
    const server = require('../../../../app/server')
    expect(server).toBeDefined()
  })
})
