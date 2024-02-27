const { Router } = require("express");
const authController = require("../controllers/authController");

const router = Router();

// If the user is already logged in, redirect to the member account page
router.use((req, res, next) => {
  if (req.url === "/logout") {
    next();
  } else {
    if (req.session.user) {
      res.redirect("/member/account");
    }
    next();
  }
});

//---------- ROUTES THAT RENDER PAGES ----------

/**
 * @description     Renders the register page
 * @route           GET /auth/register
 * @access          Public
 */
router.get("/register", authController.register_GET);

/**
 * @description     Renders the login page
 * @route           GET /auth/login
 * @access          Public
 */
router.get("/login", authController.login_GET);

//---------- ROUTES THAT CONTROL LOGIC ---------

/**
 * @description     Attempts to register a new user
 * @route           POST /auth/register
 * @access          Public
 */
router.post("/register", authController.register_POST);

/**
 * @description     Attempt to login a user
 * @route           POST /auth/login
 * @access          Public
 */
router.post("/login", authController.login_POST);

/**
 * @description     Logs out a user
 * @route           POST /auth/logout
 * @access          Public
 */
router.post("/logout", authController.logout_POST);

module.exports = router;
