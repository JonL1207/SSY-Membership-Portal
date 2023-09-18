const { Router } = require("express");
const paymentController = require("../controllers/paymentController");

const router = Router();

//--------- ROUTES THAT RENDER PAGES ----------

/**
 * @description     Renders the select membership page
 * @route           GET /payment/select-membership
 * @access          Authenticated
 */
router.get("/select-membership", paymentController.selectMembership_GET);

/**
 * @description     Renders the donate page
 * @route           GET /payment/donate
 * @access          Public
 */
router.get("/donate", paymentController.donate_GET);

//--------- ROUTES THAT CONTROL LOGIC ---------

module.exports = router;
