const account_GET = (req, res) => {
  res.render("member/account");
};

const membership_GET = (req, res) => {
  res.render("member/membership");
};

const accountUpdate_GET = (req, res) => {
  res.render("member/updateDetails");
};

const membershipUpdate_GET = (req, res) => {
  res.render("member/updateMembership");
};
module.exports = {
  account_GET,
  membership_GET,
  accountUpdate_GET,
  membershipUpdate_GET,
};
