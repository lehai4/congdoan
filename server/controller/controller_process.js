const processModels = require("../models");

const processController = {
  //Admin

  addVideoIntoProcess: async (req, res) => {
    try {
      return res.status(201).json({
        message: "Thêm thành công!",
      });
    } catch (err) {
      return res.status(500).json({ message: "Server 500 internal!" });
    }
  },

  //admin/user

  getAllStepByIdProcess: async (req, res) => {
    try {
      const { idProcess } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await processModels.getAllStepByIdProcess(
        idProcess,
        page,
        limit
      );

      res.status(200).json({
        process: result.process,
        currentPage: page,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        messages: "Lấy thành công công đoạn!",
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server 500 internal!", error: err.message });
    }
  },
  getAllProcessByIdMaHang: async (req, res) => {
    try {
      const { idMaHang } = req.params;

      const result = await processModels.getAllProcessByIdMaHang(idMaHang);
      if (result.length > 0) {
        return res.status(200).json({
          message: "Lấy mã hàng thành công!",
          success: true,
          result,
        });
      }
      return res.status(400).json({
        message: "Mã hàng không tồn tại!",
        success: false,
      });
    } catch (err) {
      return res.status(500).json({ message: "Server 500 internal!" });
    }
  },

  getInfoProcessByIdProcess: async (req, res) => {
    try {
      const { idProcess } = req.params;

      const result = await processModels.getInfoProcessByIdProcess(idProcess);
      return res.status(200).json({
        message: "Lấy thành công!",
        success: true,
        result,
      });
    } catch (err) {
      return res.status(500).json({ message: "Server 500 internal!" });
    }
  },
};

module.exports = processController;
