const bodyParser = require("body-parser");
const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1", require("./api/v1/routes/index.js"));

module.exports = app;
