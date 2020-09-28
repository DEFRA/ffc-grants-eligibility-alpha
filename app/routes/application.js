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
          businessName: Joi.string().required(),
          confirmationId: Joi.string().required(),
          emailAddress: Joi.string().required(),
          inEngland: Joi.boolean().required()
        }),
        failAction: (request, h) => h.response('Error in payload data').code(400).takeover()
      },
      handler: (request, h) => {
        console.log('New application received:')
        console.log(`In England: ${request.payload.inEngland}`)
        console.log(`Business Name: ${request.payload.businessName}`)
        console.log(`Email Address: ${request.payload.emailAddress}`)
        console.log(`ConfirmationID: ${request.payload.confirmationId}`)

        return h.response(`Created application with confirmation is ${request.payload.confirmationId}`).code(201)
      }
    }
  }
]
