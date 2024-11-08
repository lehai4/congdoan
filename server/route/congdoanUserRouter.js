const express = require("express");
const router = express.Router();

const processController = require("../controller/controller_process");
const middleWare = require("../middleware/middleware");

router.get(
  "/getAllCongDoanByIdMaHang/:idMaHang",
  middleWare.allowCors,
  middleWare.authorized,
  processController.getAllCongDoanByIdMaHang
);

module.exports = router;
