const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const login_GET = (req, res) => {
  res.render("auth/login");
};

const register_GET = (req, res) => {
  res.render("auth/register");
};

const forgotPassword_GET = (req, res) => {
  res.render("auth/forgotPassword");
};

const verification_GET = (req, res) => {
  res.render("auth/forgotPasswordVerification");
};

const newPassword_GET = (req, res) => {
  res.render("auth/newPassword");
};

const register_POST = async (req, res) => {
  try {
    var user = new User(req.body); // create new user
    await user.register(); // save the user to the db

    // create as new customer on stripe
    const customer = await stripe.customers.create({
      name: user.fullName,
      email: user.email,
    });

    // update created user with stripeID
    user.membership.stripeID = customer.id;
    await user.save();

    // set the session
    req.session.isAuthenticated = true;
    req.session.user = user;

    returnUser = await User.findOne().findByEmail(user.email, false);

    res.status(201).json({
      success: true,
      message: "User successfully registered",
      location: "/member/account",
      data: {
        user: returnUser,
      },
    });
  } catch (err) {
    //handle errors function
    console.log(err.message);
  }
};

const login_POST = (req, res) => {};

const forgotPassword_POST = (req, res) => {};

const verification_POST = (req, res) => {};

const newPassword_PATCH = (req, res) => {};

const logout_GET = (req, res) => {
  // delete session and redirect back to login
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/auth/login");
  });
};

module.exports = {
  login_GET,
  register_GET,
  forgotPassword_GET,
  newPassword_GET,
  verification_GET,
  register_POST,
  login_POST,
  forgotPassword_POST,
  verification_POST,
  newPassword_PATCH,
  logout_GET,
};
