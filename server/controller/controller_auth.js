const processModels = require("../models");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      // console.log(username, password);
      const user = await processModels.login(username, password);
      if (user) {
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            role: user.role,
          },
          process.env.SECRET_KEY
        );

        return res.status(200).json({
          message: "Đăng nhập thành công!",
          user,
          token,
        });
      } else {
        return res.status(400).json({
          message: "Username or password is incorrect!",
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ error: err.message, message: "500 server internal!" });
    }
  },

  logout: async (req, res) => {
    try {
      return res.status(204).json({
        message: "Đăng xuất thành công!",
      });
    } catch (err) {
      return res.status(500).json({ message: "Server 500 internal!" });
    }
  },
};
module.exports = authController;
