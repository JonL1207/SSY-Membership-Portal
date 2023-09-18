const { Router } = require("express");
const adminController = require("../controllers/adminController");

const router = Router();

//--------- ROUTES THAT RENDER PAGES ----------

/**
 * @description     Renders the all members page
 * @route           GET /admin/members/all
 * @access          Authenticated
 */
router.get("/members/all", adminController.getAllMembers_GET);

/**
 * @description     Renders the single member page
 * @route           GET /admin/members/single/:id
 * @access          Authenticated
 */
router.get("/members/single/:id", adminController.getSingleMember_GET);

/**
 * @description     Renders the create member page
 * @route           GET /admin/members/create
 * @access          Authenticated
 */
router.get("/members/create", adminController.createMember_GET);

/**
 * @description     Renders the update member page
 * @route           GET /admin/members/update/:id
 * @access          Authenticated
 */
router.get("/members/update/:id", adminController.updateMember_GET);

//--------- ROUTES THAT CONTROL LOGIC ---------

module.exports = router;
