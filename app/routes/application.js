const Joi = require('joi')

module.exports = [
  {
    method: 'GET',
    path: '/application',
    handler: (request, h) => {
      return h.response('Dummy response').code(200)
    }
  },
  {
    method: 'POST',
    path: '/application',
    options: {
      validate: {
        payload: Joi.object({
          confirmationId: Joi.string().required(),
          cost: Joi.string().required(),
          userId: Joi.string().required()
        }),
        failAction: (request, h) => h.response('Error in payload data').code(400).takeover()
      },
      handler: (request, h) => {
        console.log('New application received:')
        console.log(`UserID: ${request.payload.userId}`)
        console.log(`Cost: ${request.payload.cost}`)
        console.log(`ConfirmationID: ${request.payload.confirmationId}`)

        return h.response(`Created application with confirmation is ${request.payload.confirmationId}`).code(201)
      }
    }
  }
]
