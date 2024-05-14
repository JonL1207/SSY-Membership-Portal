const { Router } = require("express");
const memberController = require("../controllers/memberController");
const { isAuthenticated } = require("../middleware/authentication");

const router = Router();

// Use middleware to chek for logged in user before every request to a member resourse
router.use(isAuthenticated);

//---------- ROUTES THAT RENDER PAGES ----------

/**
 * @description     Renders the account page for the member
 * @route           GET /member/account
 * @access          Protected
 */
router.get("/account", memberController.home_GET);

//---------- ROUTES THAT CONTROL LOGIC ---------

module.exports = router;
