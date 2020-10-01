const Joi = require('joi')
const { app } = require('../server')
const Application = require('../models').Application

module.exports = [
  {
    method: 'GET',
    path: '/application',
    handler: async (request, h) => {
      if (!request.query.confirmationId) {
        return h.response('No confirmation ID provided').code(400)
      }

      const application = await Application.findOne({
        where: { confirmationId: request.query.confirmationId }
      })

      if (!application) {
        return h.response(`No application with confirmation ID ${request.query.confirmationId}`).code(400)
      }

      return h.response(application.toJSON()).code(200)
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
      handler: async (request, h) => {
        console.log('New application received:')
        console.log(`In England: ${request.payload.inEngland}`)
        console.log(`Business Name: ${request.payload.businessName}`)
        console.log(`Email Address: ${request.payload.emailAddress}`)
        console.log(`ConfirmationID: ${request.payload.confirmationId}`)

        await Application.create({
          confirmationId: request.payload.confirmationId,
          businessName: request.payload.businessName,
          emailAddress: request.payload.emailAddress,
          inEngland: request.payload.inEngland
        })

        return h.response(`Created application with confirmation ID ${request.payload.confirmationId}`).code(201)
      }
    }
  }
]
