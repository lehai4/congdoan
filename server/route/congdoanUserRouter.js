const express = require("express");
const router = express.Router();

const processController = require("../controller/controller_process");

router.get(
  "/getAllProcessByIdMaHang/:idMaHang",
  processController.getAllProcessByIdMaHang
);

router.get(
  "/getInfoProcessByIdProcess/:idProcess",
  processController.getInfoProcessByIdProcess
);

module.exports = router;
