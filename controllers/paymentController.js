const selectMembership_GET = (req, res) => {
  res.render("payment/selectMembership");
};

const donate_GET = (req, res) => {
  res.render("payment/donate");
};

module.exports = {
  selectMembership_GET,
  donate_GET,
};
