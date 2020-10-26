const config = require('../../../app/config')
const { ReceiveMode } = require('@azure/service-bus')
const { ServiceBusClient } = require('@azure/service-bus')

describe('subscription receiver', () => {
  const message = { body: 'hello' }
  const testConfig = { ...config.messaging.applicationTopic, subscription: process.env.APPLICATION_SUBSCRIPTION_ADDRESS }
  let sbClient
  let topicClient
  let subscriptionClient
  let sender

  beforeEach(async () => {
    sbClient = ServiceBusClient.createFromConnectionString(`Endpoint=sb://${testConfig.host}/;SharedAccessKeyName=${testConfig.username};SharedAccessKey=${testConfig.password}`)
    topicClient = sbClient.createTopicClient(testConfig.address)
    subscriptionClient = sbClient.createSubscriptionClient(testConfig.address, testConfig.subscription)
    sender = topicClient.createSender()
    await sender.send(message)
  })

  afterEach(async () => {
    await topicClient.close()
    await subscriptionClient.close()
    await sbClient.close()
  })

  test('subscribes to topic', () => {
    expect.assertions(1)
    let done
    const promise = new Promise((resolve) => { done = resolve })
    const action = (result) => {
      done(result.body === message.body)
    }

    const error = (err) => {
      throw (err)
    }

    const receiver = subscriptionClient.createReceiver(ReceiveMode.receiveAndDelete)
    receiver.registerMessageHandler(action, error)

    return expect(promise).resolves.toEqual(true)
  })
})
