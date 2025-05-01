function adminMiddleware(req, res, next) {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Нет доступа' });
    }
  
    next();
  }
  
  module.exports = adminMiddleware;
  