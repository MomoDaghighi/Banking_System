const roleCheckMiddleware = (roles) => {
  return (req, res, next) => {
      if (req.user && roles.includes(req.user.user_type)) {
          return next();
      } else {
          return res.status(403).json({ message: 'Access Forbidden: You do not have the right role' });
      }
  };
};

module.exports = roleCheckMiddleware;
