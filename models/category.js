module.exports = (sequelize, DataTypes) => {
    const category = sequelize.define("Category", {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('expense', 'income'),
        allowNull: false,
        defaultValue: 'expense'
      }
    })
  
    category.associate = (models) => {
      category.hasMany(models.Tracking, { foreignKey: "category_id" })
      category.belongsTo(models.Category, { foreignKey: "user_id" })
    }
  
    return category
  }
  