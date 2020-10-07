const auth = require('@azure/ms-rest-nodeauth')
const MessageSender = require('./messaging/message-sender')
const MessageReceiver = require('./messaging/message-receiver')
const config = require('../config').messaging

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
    const testAction = message => {
      console.log('Received message')
      console.log(message)
      console.log('Sending message on')
      this.publishEligibility(message)
    }
    this.eoiReceiver = new MessageReceiver('eoi-queue-receiver', config.eoiQueue, credentials, testAction)
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
