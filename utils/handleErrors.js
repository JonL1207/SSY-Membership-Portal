const handleErrors = (res, err) => {
  let errors = {};

  if (err.code === 11000) {
    errors.dataDublication = err.message;
  } else if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach((properties) => {
      errors[properties.path] = properties.message;
    });
  } else {
    errors[err.cause] = err.message;
  }

  res.json({ errors: errors });
};

module.exports = {
  handleErrors,
};
