const db = require("../models");
const { Op } = require("sequelize");

const getUserCategory = async (req, res) => {
  const userId = req.user.id;
  try {
    const userCategories = await db.Category.findAll({
      where: { user_id: userId, isActive: true },
      attributes: { exclude: ["createdAt", "updatedAt", "user_id"] },
    });
    res.status(200).send(userCategories);
  } catch (err) {
    console.log("Error fetching categories :>> ", err);
  }
};
const updateUserCategory = async (req, res) => {
  const userId = req.user.id;
  const { categoryId, name, type, isActive } = req.body;
  if (!(type.toUpperCase() === "EXPENSE" || type.toUpperCase() === "INCOME")) {
    res.status(400).send({ message: "Invalid category type" });
    return;
  }
  try {
    const targetCate = await db.Category.findOne({
      where: {
        [Op.and]: [{ id: categoryId, user_id: userId }],
      },
    });
    if (!targetCate) {
      res.status(400).send({ message: "No category found" });
      return;
    }
    const data = {
      name: name || targetCate.name,
      type: type || targetCate.type,
      isActive: isActive,
    };
    try {
      await targetCate.update(data);
      res.status(200).send({ message: "Updated successfully" });
    } catch (err) {
      console.log("error updating category :>> ", err);
    }
  } catch (err) {
    console.log("error updating category :>> ", err);
  }
};

const createUserCategory = async (req, res) => {
  const userId = req.user.id;
  const { name, type, isActive } = req.body;
  if (!(name && type)) {
    res.status(400).send({ message: "Invalid category name or type" });
    return;
  }
  if (!(type.toUpperCase() === "EXPENSE" || type.toUpperCase() === "INCOME")) {
    res.status(400).send({ message: "Invalid category type" });
    return;
  }
  try {
    const category = await db.Category.findOne({ where: { name } });
    if (category) {
      res.status(200).send({ message: "Category already exist" });
      return;
    }
    try {
      await db.Category.create({ name, type, isActive, user_id: userId });
      res.status(201).send({ message: "category created successfully" });
    } catch (err) {
      console.log("Error creating category :>> ", err);
    }
  } catch (err) {
    console.log("Error finding category in creating category :>> ", err);
  }
};
module.exports = { getUserCategory, createUserCategory, updateUserCategory };
