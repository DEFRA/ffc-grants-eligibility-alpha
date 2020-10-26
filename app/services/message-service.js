const auth = require('@azure/ms-rest-nodeauth')
const MessageSender = require('./messaging/message-sender')
const MessageReceiver = require('./messaging/message-receiver')
const config = require('../config').messaging
const Application = require('../models').Application
const XLSX = require('xlsx')

process.on('SIGTERM', async () => {
  await messageService.closeConnections()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await messageService.closeConnections()
  process.exit(0)
})

function createSpreadsheet (message) {
  const wb = XLSX.utils.book_new()

  wb.Props = {
    Title: 'This is a test',
    Author: 'FFC EOI'
  }

  wb.SheetNames.push('First Sheet')
  const ws = XLSX.utils.json_to_sheet([message])
  wb.Sheets['First Sheet'] = ws

  XLSX.writeFile(wb, 'test123.xlsx')
}

class MessageService {
  constructor (credentials) {
    this.publishEligibility = this.publishEligibility.bind(this)
    this.closeConnections = this.closeConnections.bind(this)
    this.eligibilitySender = new MessageSender('eligibility-queue-sender', config.eligibilityQueue, credentials)

    const receiveEOIAction = async message => {
      console.log('Received message, adding to DB')

      const messageObj = JSON.parse(message)

      await Application.create({
        confirmationId: messageObj.confirmationId,
        inEngland: messageObj.inEngland,
        businessName: messageObj.businessName,
        emailAddress: messageObj.emailAddress
      })

      createSpreadsheet(messageObj)

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

      await this.publishEligibility(JSON.stringify(emailMessage))
      await this.publishEligibility(JSON.stringify(eoiSubmittedMessage))
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
