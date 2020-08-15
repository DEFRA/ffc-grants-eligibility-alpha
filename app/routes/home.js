module.exports = {
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return h.response('Hello from Grants Eligibility').code(200)
  }
}
