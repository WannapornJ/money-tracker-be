const db = require("../models");
const bc = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username && email && password)) {
    res.status(400).send({ message: "Invalid username, email or password" });
    return;
  }
  const user = await db.User.findOne({
    where: { [Op.or]: [{ username }, { email }] },
  });
  if (user) {
    res.status(200).send({
      message: "this username or email already used",
    });
    return;
  }
  const salt = bc.genSaltSync(Number(process.env.ROUNDS));
  const hashedPW = bc.hashSync(password, salt);

  await db.User.create({
    username,
    email,
    password: hashedPW,
  });
  res.status(201).send({ message: "user created" });
};

const login = async (req, res) => {
  const { account, password } = req.body;
  if (!(account && password)) {
    res.status(400).send({ message: "Invalid username or password" });
    return;
  }
  const user = await db.User.findOne({
    where: { [Op.or]: [{ username: account }, { email: account }] },
  });
  if (!user) {
    res.status(400).send({ message: "Username or Password not correct" });
    return;
  }
  const isPWCorrect = bc.compareSync(password, user.password);
  if (isPWCorrect) {
    const payload = {
      id: user.id,
      username: user.username,
    };
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "1h",
    });
    res.status(200).send({
      message: "successfully login",
      access_token: token,
    })
  } else {
    res.status(400).send({ message: "Username or Password is wrong" });
  }
};
module.exports = {
  login,
  register,
};
