const connectionDetails = {
  host: process.env.MESSAGE_QUEUE_HOST,
  password: process.env.MESSAGE_QUEUE_PASSWORD,
  username: process.env.MESSAGE_QUEUE_USER
}

module.exports = {
  eoiQueue: {
    address: process.env.EOI_QUEUE_ADDRESS,
    type: 'queue',
    ...connectionDetails
  },
  applicationTopic: {
    address: process.env.APPLICATION_TOPIC_ADDRESS,
    type: 'topic',
    ...connectionDetails
  },
  contactTopic: {
    address: process.env.CONTACT_TOPIC_ADDRESS,
    type: 'topic',
    ...connectionDetails
  }
}
