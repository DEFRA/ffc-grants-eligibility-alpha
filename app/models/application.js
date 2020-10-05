module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define(
    'Application',
    {
      confirmationId: DataTypes.STRING,
      businessName: DataTypes.STRING,
      emailAddress: DataTypes.STRING,
      inEngland: DataTypes.BOOLEAN
    },
    {
      tableName: 'applications',
      timestamps: true,
      updatedAt: false
    }
  )

  Application.createAssociations = models => {
    console.log('No associations for the Applications model')
  }

  return Application
}
