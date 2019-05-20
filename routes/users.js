const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");
const gravtar = require("gravatar");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const { Users, regValidate, logValidate } = require("../models/Users");
const auth = require("./auth");
/**
 *  @meth GET METHOD
 *  @des  Get all users
 */
router.get("/", auth, async (req, res) => {
  await Users.find()
    .select(["email", "avatar", "username", "date"])
    .then(users => {
      if (!users) return res.status(404).send("No users found");
      return res.json(users);
    })
    .catch(err => res.status(400).send(`Something went wrong - ${err}`));
});
/**
 *  @meth POST METHOD
 *  @des  Register Users
 */
router.post("/register", async (req, res) => {
  // Validation
  const { error } = regValidate(req.body);
  if (error) {
    return res.status(400).json({
      type: error.details[0].path[0].toString(),
      msg: error.details[0].message.toString()
    });
  }
  // Check for Username unique
  Users.findOne({ username: req.body.username }).then(user => {
    if (user)
      return res.status(400).json({
        type: "username",
        msg: "Username is taken try another."
      });
    // Check for Email  registred or not
    Users.findOne({ email: req.body.email }).then(email => {
      if (email)
        return res.status(400).json({
          type: "email",
          msg: "Email is already registred."
        });
      // New User
      const avatar = gravtar.url(req.body.email, { s: 200, r: "pg", d: "mm" });
      const newUser = new Users({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        avatar: avatar,
        email: req.body.email,
        password: req.body.password
      });
      // Hshing the password
      bcrypt.genSalt(10, async (err, salt) => {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          // Saving the user to db
          await newUser
            .save()
            .then(user => res.json(user))
            .catch(err => res.status(400).send(`Something went wrong ${err}`));
        });
      });
    });
  });
});
/**
 *  @meth POST METHOD
 *  @des  Login Users
 */
router.post("/login", async (req, res) => {
  // validation
  const { error } = logValidate(req.body);
  if (error) {
    return res.status(400).json({
      type: error.details[0].path[0].toString(),
      msg: error.details[0].message.toString()
    });
  }
  // Check email is registred or not
  await Users.findOne({ email: req.body.email }).then(user => {
    if (!user)
      return res.status(400).json({
        type: "email",
        msg: "Email is not registred."
      });
    // Check password
    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if (!isMatch) {
        return res.status(400).json({
          type: "password",
          msg: "Incorrect Password."
        });
      } else {
        const payload = {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar
        };
        jwt.sign(payload, keys.secretKey, { expiresIn: 3600 }, (err, token) => {
          res.json(token);
          res.header("auth-header", token);
        });
      }
    });
  });
});

module.exports = router;
