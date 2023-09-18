const { Router } = require("express");
const memberController = require("../controllers/memberController");

const router = Router();

//--------- ROUTES THAT RENDER PAGES ----------

/**
 * @description     Renders the account details page
 * @route           GET /member/account
 * @access          Authenticated
 */
router.get("/account", memberController.account_GET);

/**
 * @description     Renders the membership details page
 * @route           GET /member/membership
 * @access          Authenticated
 */
router.get("/membership", memberController.membership_GET);

/**
 * @description     Renders the account details update page
 * @route           GET /member/account/update
 * @access          Authenticated
 */
router.get("/account/update", memberController.accountUpdate_GET);

/**
 * @description     Renders the membership details update page
 * @route           GET /member/membership/update
 * @access          Authenticated
 */
router.get("/membership/update", memberController.membershipUpdate_GET);

//--------- ROUTES THAT CONTROL LOGIC ---------

module.exports = router;
