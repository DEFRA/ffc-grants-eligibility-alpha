const connectionDetails = {
  host: process.env.MESSAGE_QUEUE_HOST,
  password: process.env.MESSAGE_QUEUE_PASSWORD,
  username: process.env.MESSAGE_QUEUE_USER
}

module.exports = {
  eoiQueue: {
    address: process.env.EOI_QUEUE_ADDRESS,
    ...connectionDetails
  },
  eligibilityQueue: {
    address: process.env.ELIGIBILITY_QUEUE_ADDRESS,
    ...connectionDetails
  }
}
