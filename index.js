require("dotenv").config();
require("./config/passport");

const express = require("express");
const app = express();
const db = require("./models");
const cors = require("cors");
const userRouter = require('./routes/user');
const categoryRouter = require('./routes/category');
const trackingRouter = require('./routes/tracking');

let allowedOrigins = ['http://localhost:3000'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        let mes = "can not access";
        return callback(new Error(mes), false);
      }

      return callback(null, true);
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use('/tracking', trackingRouter);
app.get('*', (req, res) => {
  res.status(404)
})

db.sequelize.sync({ force: false }).then(() => {
  server = app.listen(process.env.PORT || 8001, () => {
    console.log(
      `Server is running at ${process.env.PORT}\n\n 01001101 01101111 01101110 01100101 01111001  01110100 01110010 01100001 01100011 01101011 01101001 01101110 01100111 \n`
    );
  });
});
