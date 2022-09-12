const db = require("../models");
const { Op } = require("sequelize");

const getAllTrackingByDate = async (req, res) => {
  const userId = req.user.id;
  const { day } = req.params;
  d = new Date(day).toISOString().slice(0, 10);
  try {
    const targetTracking = await db.Category.findAll({
      where: { user_id: userId },
      attribute: { exclude: ["user_id", "createdAt", "updatedAt"] },
      include: [{ model: db.Tracking, where: { date: d } }],
    });
    const total = await db.Tracking.sum("cost", { where: { date: d } });
    const expType = await db.Category.findAll({
      where: { type: "expense" },
      attributes: ["id"],
    });
    const incType = await db.Category.findAll({
      where: { type: "income" },
      attributes: ["id"],
    });
    const exp = expType.map(({ id }) => id);
    const inc = incType.map(({ id }) => id);
    const expense = await db.Tracking.sum("cost", {
      where: {
        [Op.and]: [
          {
            category_id: {
              [Op.in]: exp,
            },
          },
          {
            date: d,
          },
        ],
      },
    });
    const income = await db.Tracking.sum("cost", {
      where: {
        [Op.and]: [
          {
            category_id: {
              [Op.in]: inc,
            },
          },
          {
            date: d,
          },
        ],
      },
    });
    res.status(200).send({ targetTracking, total, expense, income });
  } catch (err) {
    console.log("err :>> ", err);
  }
};

const getAllTrackingByWeek = async (req, res) => {
  const userId = req.user.id;
  const {week} = req.params
  let weekD = []
  for (let i =0; i < 7 * week; i++) {
    let day = new Date(new Date().getTime() - i * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)
    weekD.push(day)
  }
  try {
    const targetTracking = await db.Category.findAll({
      where: { user_id: userId },
      attribute: { exclude: ["user_id", "createdAt", "updatedAt"] },
      include: [
        {
          model: db.Tracking,
          where: {
            date: {
              [Op.in]: weekD.slice(-7),
            },
          },
        },
      ],
    });
    const total = await db.Tracking.sum("cost", { where: { date: {[Op.in]: weekD} } });
    const expType = await db.Category.findAll({
      where: { type: "expense" },
      attributes: ["id"],
    });
    const incType = await db.Category.findAll({
      where: { type: "income" },
      attributes: ["id"],
    });
    const exp = expType.map(({ id }) => id);
    const inc = incType.map(({ id }) => id);
    const expense = await db.Tracking.sum("cost", {
      where: {
        [Op.and]: [
          {
            category_id: {
              [Op.in]: exp,
            },
          },
          {
            date: {
              [Op.in]: weekD.slice(-7),
            },
          },
        ],
      },
    });
    const income = await db.Tracking.sum("cost", {
      where: {
        [Op.and]: [
          {
            category_id: {
              [Op.in]: inc,
            },
          },
          {
            date: {
              [Op.in]: weekD,
            },
          },
        ],
      },
    });
    res.status(200).send({ targetTracking, total, expense, income });
  } catch (err) {
    console.log("err :>> ", err);
  }
};

const getAllTrackingByMonth = async (req, res) => {
  const userId = req.user.id;
  const { month } = req.params;
  try {
    const targetTracking = await db.Category.findAll({
      where: { user_id: userId },
      attribute: { exclude: ["user_id", "createdAt", "updatedAt"] },
      include: [{ model: db.Tracking, where: { month } }],
    });
    const total = await db.Tracking.sum("cost", { where: { month } });
    const expType = await db.Category.findAll({
      where: { type: "expense" },
      attributes: ["id"],
    });
    const incType = await db.Category.findAll({
      where: { type: "income" },
      attributes: ["id"],
    });
    const exp = expType.map(({ id }) => id);
    const inc = incType.map(({ id }) => id);
    const expense = await db.Tracking.sum("cost", {
      where: {
        [Op.and]: [
          {
            category_id: {
              [Op.in]: exp,
            },
          },
          {
            month,
          },
        ],
      },
    });
    const income = await db.Tracking.sum("cost", {
      where: {
        [Op.and]: [
          {
            category_id: {
              [Op.in]: inc,
            },
          },
          {
            month,
          },
        ],
      },
    });
    res.status(200).send({ targetTracking, total, expense, income });
    res.status(200).send({ expType });
  } catch (err) {
    console.log("err :>> ", err);
  }
};

const getTransaction = async (req, res) => {
  const userId = req.user.id;
  const { trackId } = req.params;
  try {
    const transaction = await db.Tracking.findOne({
      where: {
        [Op.and]: [{ user_id: userId }, { id: trackId }],
      },
      attributes: { exclude: ["user_id", "createdAt", "updatedAt"] },
      include: "Category",
    });
    if (!transaction) {
      res.status(400).send({ message: "Tracking not found" });
      return;
    }
    res.status(200).send({ transaction });
  } catch (err) {
    console.log("err :>> ", err);
  }
};

const editTransaction = async (req, res) => {
  const userId = req.user.id;
  const { trackId } = req.params;
  const { title, date, month, year, bill_img, cost, cateId } = req.body;
  const transaction = await db.Tracking.findOne({
    where: {
      [Op.and]: [{ id: trackId }, { user_id: userId }],
    },
  });
  if (!transaction) {
    res.status(400).send({ message: "No transaction found" });
    return;
  }
  try {
    const d = new Date(date || transaction.date).toISOString().slice(0, 10);
    const cate = await db.Category.findOne({
      where: { [Op.and]: [{ id: cateId }, { user_id: userId }] },
    });
    await transaction.update({
      title: title || transaction.title,
      date: d || transaction.date,
      month: month || d.slice(5, 7) || transaction.month,
      year: year || d.slice(0, 4) || transaction.year,
      bill_img: bill_img || transaction.bill_img,
      cost: cate.type === "expense" ? cost * -1 : cost || transaction.cost,
      category_id: cateId || transaction.category_id,
    });
    res.status(200).send({ message: "Updated transaction" });
  } catch (err) {
    console.log("err :>> \n", err);
  }
};

const deleteTransaction = async (req, res) => {
  const userId = req.user.id;
  const { trackId } = req.params;
  const target = await db.Tracking.findOne({
    where: {
      [Op.and]: [{ id: trackId }, { user_id: userId }],
    },
  });
  if (!target) {
    return res.status(400).send({ message: "Tracking not found" });
  }
  await target.destroy();
  res.status(200).send({ message: "Tracking deleted" });
};

const newTransaction = async (req, res) => {
  const userId = req.user.id;
  const { title, date, month, year, bill_img, cost, cateId } = req.body;
  if (!(title, date, cost, cateId)) {
    res
      .status(400)
      .send({ message: "title, date, category and cost cannot be blank" });
    return;
  }
  const d = new Date(date).toISOString().slice(0, 10);
  const transaction = await db.Tracking.findOne({
    where: {
      [Op.and]: [
        { title },
        { cost },
        { date: d },
        { category_id: cateId },
        { user_id: userId },
      ],
    },
  });
  if (transaction) {
    res.status(400).send({ message: "transaction already exists" });
    return;
  }
  const cate = await db.Category.findOne({
    where: { [Op.and]: [{ id: cateId }, { user_id: userId }] },
  });
  await db.Tracking.create({
    title,
    cost: cate.type === "expense" ? cost * -1 : cost,
    date: d,
    bill_img: bill_img || null,
    month: month || d.slice(5, 7),
    year: year || d.slice(0, 4),
    category_id: cateId,
    user_id: userId,
  });
  res.status(201).send({ message: "created successfully" });
};

module.exports = {
  getAllTrackingByDate,
  getAllTrackingByWeek,
  getAllTrackingByMonth,
  getTransaction,
  editTransaction,
  deleteTransaction,
  newTransaction,
};
