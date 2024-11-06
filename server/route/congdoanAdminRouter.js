const express = require("express");
const router = express.Router();
const processController = require("../controller/controller_process");
const middleWare = require("../middleware/middleware");

router.get("/getAllMaHang", processController.getAllMaHang);

router.get(
  "/getAllProcessByIdMaHang/:idMaHang",
  processController.getAllProcessByIdMaHang
);

router.get(
  "/getAllStepByIdProcess/:idProcess",
  processController.getAllStepByIdProcess
);

router.get(
  "/getInfoStepByIdProcess/:idProcess",
  processController.getInfoProcessByIdProcess
);

router.post(
  "/:id/step:stepId/video",
  middleWare.allowCors,
  middleWare.authorized,
  processController.addVideoIntoProcess
);

module.exports = router;
