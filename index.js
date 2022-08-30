require('dotenv').config();
require('./config/passport');

const express = require('express');
const app = express();
const db = require('./models');
const cors = require('cors');

let allowedOrigins = ['http://localhost:3000'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        let mes = 'can not access';
        return callback(new Error(mes), false);
      }

      return callback(null, true);
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/customers', RoutesCustomers);

db.sequelize.sync({ force: false }).then(() => {
  server = app.listen(process.env.PORT || 8001, () => {
    console.log(`Server is running at ${process.env.PORT}`);
  });
});
