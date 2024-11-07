const processModels = require("../models");

const processController = {
  addProcessIsSaveLink: async (req, res) => {
    try {
      const data = req.body;
      await processModels.addProcessIsSaveLink(data);
      return res.status(201).json({
        message: "Thêm thành công!",
      });
    } catch (err) {
      return res.status(500).json({ message: "Server 500 internal!" });
    }
  },

  uploadProcessToDataBase: async (req, res) => {
    try {
      const data = req.body;
      await processModels.uploadProcessToDataBase(data);
      return res.status(201).json({
        message: "Thêm thành công!",
      });
    } catch (err) {
      return res.status(500).json({ message: "Server 500 internal!" });
    }
  },

  getAllMaHang: async (req, res) => {
    try {
      const arrMaHang = await processModels.getAllMaHang();
      if (arrMaHang.length > 0) {
        return res.status(200).json(arrMaHang);
      } else {
        return res
          .status(400)
          .json({ message: "Không tìm thấy bất kỳ mã hàng nào!" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Server 500 internal" });
    }
  },

  getAllProcessIsSaveLink: async (req, res) => {
    try {
      const result = await processModels.getAllProcessIsSaveLink();
      if (result.length > 0) {
        return res.status(200).json(result);
      } else {
        return res
          .status(400)
          .json({ message: "Không tìm thấy bất kỳ dữ liệu nào!" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Server 500 internal" });
    }
  },

  getAllStepByIdProcess: async (req, res) => {
    try {
      const { idProcess } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;

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
        limit: result.limit,
        messages: "Lấy thành công tất cả công đoạn!",
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
          message: "Lấy qui trình thành công!",
          success: true,
          result,
        });
      }
      return res.status(400).json({
        message: "Không tìm thấy quy trình!",
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
