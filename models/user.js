
module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define("User", {
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password : {
        type: DataTypes.STRING,
        allowNull: false
      }
    })
  
    user.associate = (models) => {
      user.hasMany(models.Tracking, { foreignKey: "user_id" })
      user.hasMany(models.Category, { foreignKey: "user_id" })
    }
  
    return user
  }
  