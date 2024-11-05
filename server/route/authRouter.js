const express = require("express");
const router = express.Router();
const authController = require("../controller/controller_auth");
const middleWare = require("../middleware/middleware");

router.post("/login", middleWare.allowCors, authController.login);

router.post("/logout", middleWare.allowCors, authController.logout);

module.exports = router;
