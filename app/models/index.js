const fs = require('fs')
const path = require('path')
const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize(require('../config').database)

fs.readdirSync(__dirname)
  .filter(file => (file !== path.basename(__filename)) && (file.slice(-3) === '.js'))
  .forEach(file => require(`./${file}`)(sequelize, DataTypes))

for (const model of Object.values(sequelize.models)) {
  if (model.createAssociations) {
    model.createAssociations(sequelize.models)
  }
}

module.exports = sequelize.models
