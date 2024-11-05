const authRouter = require("./authRouter");
const processAdminRouter = require("./congdoanAdminRouter");
const processUserRouter = require("./congdoanUserRouter");

const Route = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/admin/process", processAdminRouter);
  app.use("/api/user/process", processUserRouter);
};

module.exports = Route;
