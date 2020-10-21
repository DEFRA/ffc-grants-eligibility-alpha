const MessageBase = require('./message-base')

class MessageSender extends MessageBase {
  constructor (name, config, credentials) {
    super(name, config, credentials)
    this.topicClient = this.sbClient.createTopicClient(config.address)
  }

  async sendMessage (message) {
    const sender = this.topicClient.createSender()
    try {
      console.log(`${this.name} sending message`, message)

      await sender.send({ body: message })
      console.log(`message sent ${this.name}`)
    } finally {
      await sender.close()
    }
  }
}

module.exports = MessageSender
