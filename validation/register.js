const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  const {name, email, password, password2} = data;
  data.name = name.trim();
  data.email = email.trim();
  data.password = password.trim();
  data.password2 = password2.trim();
  if (!data.name) errors.name = "Name field is required";
  if (!data.email) errors.email = "Email field is required";
  else if (!Validator.isEmail(data.email)) errors.email = "Email is invalid";
  if (!data.password) errors.password = "Password field is required";
  if (!data.password2) errors.password2 = "Please confirm your password";
  if (!Validator.isLength(password, {min: 6, max: 30})) errors.password = "Password must be at least 6 characters";
  if (data.password !== data.password2) errors.password2 = "Passwords must match";

  return {errors,isValid: isEmpty(errors)};
};