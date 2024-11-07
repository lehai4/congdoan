const express = require("express");
const router = express.Router();
const processController = require("../controller/controller_process");
const middleWare = require("../middleware/middleware");

router.get("/getAllMaHang", processController.getAllMaHang);

router.get(
  "/getAllProcessIsSaveLink",
  processController.getAllProcessIsSaveLink
);

router.get(
  "/getAllProcessByIdMaHang/:idMaHang",
  processController.getAllProcessByIdMaHang
);

router.get(
  "/getAllStepByIdProcess/:idProcess",
  processController.getAllStepByIdProcess
);

router.post(
  "/uploadProcessToDataBase",
  middleWare.allowCors,
  middleWare.authorized,
  processController.uploadProcessToDataBase
);

router.post(
  "/addProcessIsSaveLink",
  middleWare.allowCors,
  middleWare.authorized,
  processController.addProcessIsSaveLink
);

module.exports = router;
