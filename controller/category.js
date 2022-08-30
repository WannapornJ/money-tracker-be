const db = require("../models");
const { Op } = require("sequelize");

const getUserCategory = async (req, res) => {
  const userId = req.user.id;
  const userCategories = await db.User_Category.findAll({
    where: { user_id: userId },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  res.status(200).send(userCategories);
};
const updateUserCategory = async (req, res) => {
  const userId = req.user.id;
  const { categoryId, name, type } = req.body;
  if (!(type.toUpperCase() === "EXPENSE" || type.toUpperCase() === "INCOME")) {
    res.status(400).send({ message: "Invalid category type" });
    return;
  }
  const targetCate = await db.Category.findOne({
    where: {
      [Op.and]: [{ id: categoryId, user_id: userId }],
    },
  });
  if (!targetCate) {
    res.status(400).send({ message: "No category found" });
    return;
  }
  if (name && type && targetCate.name !== name && targetCate.type !== type) {
    await targetCate.update({ name, type });
    res.status(200).send({ message: "Updated category name and type" });
  } else if (name && targetCate.name !== name) {
    await targetCate.update({ name });
    res.status(200).send({ message: "Updated category name" });
  } else if (type && targetCate.type !== type) {
    await targetCate.update({ type });
    res.status(200).send({ message: "Updated category type" });
  } else {
    res.status(200).send({ message: "Invalid category name or type" });
  }
};

const createUserCategory = async (req, res) => {
  const userId = req.user.id;
  const { name, type } = req.body;
  if (!(name && type)) {
    res.status(400).send({ message: "Invalid category name or type" });
    return;
  }
  if (!(type.toUpperCase() === "EXPENSE" || type.toUpperCase() === "INCOME")) {
    res.status(400).send({ message: "Invalid category type" });
    return;
  }
  const category = await db.Category.findOne({ where: { name } });
  if (category) {
    res.status(200).send({ message: "Category already exist" });
    return;
  }
  await db.Category.create({ name, type, user_id: userId });
  res.status(201).send({ message: "category created successfully" });
};
module.exports = { getUserCategory, createUserCategory, updateUserCategory };
