const fs = require('fs')
const path = require('path')

module.exports = fs.readdirSync(__dirname)
  .filter(file => (file !== path.basename(__filename)) && (file.slice(-3) === '.js'))
  .map(file => require(`./${file}`))
  .flat()
