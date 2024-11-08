const jwt = require("jsonwebtoken");
require("dotenv").config();

const middleWare = {
  allowCors: async (req, res, next) => {
    next();
  },

  authorized: async (req, res, next) => {
    const author = req?.headers && req.headers["authorization"];

    if (author) {
      const token = author.split(" ")[1];
      jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
        if (err) {
          return res.status(403).json({ success: false, message: err.message });
        }
        console.log("user", user);
        req.Token = user;
        console.log("next...");
        next();
      });
    } else {
      return res
        .status(401)
        .json({ message: "You're not authenticated", success: false });
    }
  },
};
module.exports = middleWare;
