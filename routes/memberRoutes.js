const { Router } = require("express");
const memberController = require("../controllers/memberController");

const router = Router();

//---------- ROUTES THAT RENDER PAGES ----------

/**
 * @description     Renders the account page for the member
 * @route           GET /member/account
 * @access          Protected
 */
router.get("/account", memberController.home_GET);

//---------- ROUTES THAT CONTROL LOGIC ---------

module.exports = router;
