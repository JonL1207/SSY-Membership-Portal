const { Router } = require("express");
const authController = require("../controllers/authController");

const router = Router();

//--------- ROUTES THAT RENDER PAGES ----------

/**
 * @description     Renders the login page
 * @route           GET /auth/login
 * @access          Public
 */
router.get("/login", authController.login_GET);

/**
 * @description     Renders the register page
 * @route           GET /auth/register
 * @access          Public
 */
router.get("/register", authController.register_GET);

/**
 * @description     Renders the forgot password page
 * @route           GET /auth/forgot-password
 * @access          Public
 */
router.get("/forgot-password", authController.forgotPassword_GET);

/**
 * @description     Renders the verification code for new password page
 * @route           GET /auth/forgot-password/verification?email=user.email
 * @access          Public
 */
router.get("/forgot-password/verification", authController.verification_GET);

/**
 * @description     Renders the new password page
 * @route           GET /auth/new-password?id=user._id
 * @access          Public
 */
router.get("/new-password", authController.newPassword_GET);

//--------- ROUTES THAT CONTROL LOGIC ---------

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
router.post('/login', authController.login_POST)

/**
 * @description     Retrieves email of user and redirects to verification page
 * @route           POST /auth/forgot-password
 * @access          Public
 */
router.post('/forgot-password', authController.forgotPassword_POST)

/**
 * @description     Verifies by email that the user is the owner of the acocunt
 * @route           POST /auth/forgot-password/verification/:id
 * @access          Public
 */
router.post('/forgot-password/verification/:id', authController.verification_POST)

/**
 * @description     Updates a users password    
 * @route           PATCH /auth/new-password/:id
 * @access          Public
 */
router.patch('/new-password/:id', authController.newPassword_PATCH)

/**
 * @description     Logs out a user
 * @route           GET /auth/logout
 * @access          Public
 */
router.get('/logout', authController.logout_GET)

module.exports = router;
