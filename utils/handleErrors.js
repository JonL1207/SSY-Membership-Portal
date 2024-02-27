const handleErrors = (res, err) => {
  let errors = { success: false, error: true, message: '' };

  if (err.code === 11000) {
    errors.message = err.message;
  } else if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach((properties) => {
      errors.message = properties.message;
    });
  } else {
    errors.message = err.message;
  }

  res.json(errors);
};

module.exports = {
  handleErrors,
};
