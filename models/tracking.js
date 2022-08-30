module.exports = (sequelize, DataTypes) => {
    const tracking = sequelize.define("Tracking", {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: new Date().toString()
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: new Date().getFullYear()
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: new Date().getMonth()
      },
      bill_img: {
        type: DataTypes.STRING,
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull:false
      }
    })
  
    tracking.associate = (models) => {
      tracking.belongsTo(models.User, { foreignKey: "user_id" })
      tracking.belongsTo(models.Category, { foreignKey: "category_id" })
    }
  
    return tracking
  }
  