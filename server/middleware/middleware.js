const middleWare = {
  allowCors: async (req, res, next) => {
    next();
  },

  protectTedRoute: async (req, res, next) => {
    next();
  },
  authorized: async (req, res, next) => {
    next();
  },
};
module.exports = middleWare;
