const auth = require('@azure/ms-rest-nodeauth')
const MessageSender = require('./messaging/message-sender')
const MessageReceiver = require('./messaging/message-receiver')
const config = require('../config').messaging
const Application = require('../models').Application

process.on('SIGTERM', async () => {
  await messageService.closeConnections()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await messageService.closeConnections()
  process.exit(0)
})

class MessageService {
  constructor (credentials) {
    this.publishEligibility = this.publishEligibility.bind(this)
    this.closeConnections = this.closeConnections.bind(this)
    this.eligibilitySender = new MessageSender('eligibility-queue-sender', config.eligibilityQueue, credentials)

    const receiveEOIAction = async message => {
      console.log('Received message, adding to DB')
      await Application.create(JSON.parse(message))
      console.log('Sending message on')
      this.publishEligibility(message)
    }

    this.eoiReceiver = new MessageReceiver('eoi-queue-receiver', config.eoiQueue, credentials, receiveEOIAction)
  }

  async closeConnections () {
    await this.eoiReceiver.closeConnection()
  }

  async publishEligibility (message) {
    try {
      return await this.eligibilitySender.sendMessage(message)
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}

let messageService

config.isProd = process.env.NODE_ENV === 'production'

module.exports = (async function createConnections () {
  const credentials = config.isProd ? await auth.loginWithVmMSI({ resource: 'https://servicebus.azure.net' }) : undefined
  messageService = new MessageService(credentials)
  return messageService
}())
