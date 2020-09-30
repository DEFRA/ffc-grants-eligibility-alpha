module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define('Application', {
    confirmationId: DataTypes.STRING,
    businessName: DataTypes.STRING,
    emailAddress: DataTypes.STRING,
    inEngland: DataTypes.BOOLEAN
  }, {
    tableName: 'applications',
    timestamps: true,
    updatedAt: false
  })
  return Application
}
