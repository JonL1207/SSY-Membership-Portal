const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
// const { sendEmail } = require("../utils/sendEmail");
const { handleErrors } = require("../utils/handleErrors");

const register_GET = (req, res) => {
  res.render("auth/register");
};

const login_GET = (req, res) => {
  res.render("auth/login");
};

/**
 * @todo  create new customer on stripe
 * @todo  update the created user with stripeID
 * @todo  send confirmation email
 */
const register_POST = async (req, res) => {
  try {
    // Create new user and attempt to save to db
    var user = new User(req.body);
    await user.register();

    // Set the session
    req.session.isAuthenticated = true;
    req.session.user = user;

    // Redirect to home(will be updated to select membership in future)
    res.redirect("/member/account");
  } catch (err) {
    handleErrors(res, err);
  }
};

const login_POST = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Attempt to log in the user
    const user = await User.login(email, password);

    // Set the session
    req.session.isAuthenticated = true;
    req.session.user = user;

    res.redirect('/member/account')
  } catch (err) {
    handleErrors(res, err);
  }
};

const logout_POST = (req, res) => {
  // Delete session and redirect back to login
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/auth/login");
  });
};

module.exports = {
  register_GET,
  login_GET,
  register_POST,
  login_POST,
  logout_POST,
};
