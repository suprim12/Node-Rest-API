const express = require("express");
const mongoose = require("mongoose");
const { dbURI } = require("./config/keys");
const users = require("./routes/users");
const app = express();
// Connection
mongoose
  .connect(dbURI, { useNewUrlParser: true })
  .then(res => console.log(`Connected to db`))
  .catch(err => console.error(`Connection Error ${err}`));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes Middleware
app.use("/api/users", users);
// Listen
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening at port ${port}`));
