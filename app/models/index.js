const fs = require('fs')
const path = require('path')
const dbConfig = require('../config').database
const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig)

fs.readdirSync(__dirname)
  .filter(file => (file !== path.basename(__filename)) && (file.slice(-3) === '.js'))
  .forEach(file => require(`./${file}`)(sequelize, DataTypes))

for (const model of Object.values(sequelize.models)) {
  if (model.createAssociations) {
    model.createAssociations(sequelize.models)
  }
}

module.exports = sequelize.models
