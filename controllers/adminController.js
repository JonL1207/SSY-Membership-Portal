const getAllMembers_GET = (req, res) => {
  res.render("admin/allMembers");
};

const getSingleMember_GET = (req, res) => {
  res.render("admin/singleMember");
};

const createMember_GET = (req, res) => {
  res.render("admin/createMember");
};

const updateMember_GET = (req, res) => {
  res.render("admin/updateMember");
};

module.exports = {
  getAllMembers_GET,
  getSingleMember_GET,
  createMember_GET,
  updateMember_GET,
};
