require("./config/config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var colors = require("colors");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//configuracion global de rutas
app.use(require("./routes/index"));



mongoose.connect(
  process.env.URLDB,
  { useNewUrlParser: true },
  (err, res) => {
    if (err) throw err;

    console.log("BASE DE DATOS:".yellow, "ONLINE".green);
  }
);

app.listen(process.env.PORT, () => {
  console.log("SERVER: ".yellow, `${process.env.PORT}`.green);
});
