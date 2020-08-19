const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};
  const {email, password} = data
  data.email = email.trim();
  data.password = password.trim();

  if (!data.email) errors.email = "Email field is required";
  else if (!Validator.isEmail(data.email)) errors.email = "Email is invalid";
  if (!data.password) errors.password = "Password field is required";

  return {errors,isValid: isEmpty(errors)};
};