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
    this.publishApplication = this.publishApplication.bind(this)
    this.publishContact = this.publishContact.bind(this)
    this.closeConnections = this.closeConnections.bind(this)
    this.applicationSender = new MessageSender('application-topic-sender', config.applicationTopic, credentials)
    this.contactSender = new MessageSender('contact-topic-sender', config.contactTopic, credentials)

    const receiveEOIAction = async message => {
      console.log('Received message, adding to DB')

      const messageObj = JSON.parse(message)
      messageObj.inProgress ? console.log('In Progress App') : console.log('Complete App')
      messageObj.progressEmailAddress ? console.log('Send email') : console.log('Don\'t email')

      await Application.create({
        confirmationId: messageObj.confirmationId,
        inEngland: messageObj.inEngland,
        businessName: messageObj.businessName,
        emailAddress: messageObj.emailAddress
      })

      console.log('Sending message on')

      const emailMessage = {
        messageType: 'email',
        payload: {
          emailAddress: messageObj.emailAddress,
          magicLink: messageObj.magicLink
        }
      }

      const eoiSubmittedMessage = {
        messageType: 'eoiSubmitted',
        payload: {
          confirmationId: messageObj.confirmationId
        }
      }

      await this.publishContact(JSON.stringify(emailMessage))
      await this.publishApplication(JSON.stringify(eoiSubmittedMessage))
    }

    this.eoiReceiver = new MessageReceiver('eoi-queue-receiver', config.eoiQueue, credentials, receiveEOIAction)
  }

  async closeConnections () {
    await this.eoiReceiver.closeConnection()
  }

  async publishApplication (message) {
    try {
      return await this.applicationSender.sendMessage(message)
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async publishContact (message) {
    try {
      return await this.contactSender.sendMessage(message)
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
