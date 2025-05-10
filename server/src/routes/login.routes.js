const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login.controller");

router.post("/record/:userId", loginController.recordLogin);
router.get("/get/:userId", loginController.getLogins);

module.exports = router;
