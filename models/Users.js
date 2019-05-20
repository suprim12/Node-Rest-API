const mongoose = require("mongoose");
const Joi = require("joi");

// Schema
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    maxlength: 30,
    minlength: 3
  },
  lastname: {
    type: String,
    required: true,
    maxlength: 30,
    minlength: 3
  },
  username: {
    type: String,
    required: true,
    maxlength: 30,
    minlength: 3
  },
  avatar: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Models
const Users = new mongoose.model("users", userSchema);
// Validation
function regValidation(user) {
  const schema = {
    firstname: Joi.string()
      .min(3)
      .max(30)
      .required(),
    lastname: Joi.string()
      .min(3)
      .max(30)
      .required(),
    username: Joi.string()
      .min(3)
      .max(30)
      .required(),
    avatar: Joi.optional(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required()
  };
  return Joi.validate(user, schema);
}
// Validation
function logValidation(user) {
  const schema = {
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required()
  };
  return Joi.validate(user, schema);
}
// Exports
exports.Users = Users;
exports.regValidate = regValidation;
exports.logValidate = logValidation;
