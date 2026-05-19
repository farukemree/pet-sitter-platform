/**
 * Authorization Middleware
 * Role-based access control
 */

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Kimlik doğrulaması gerekli'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz yok'
      });
    }

    next();
  };
};

const requireSitter = authorize('sitter');
const requireOwner = authorize('owner');

const requireOwnership = (paramName = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Kimlik doğrulaması gerekli'
      });
    }

    const resourceUserId = parseInt(req.params[paramName] || req.body[paramName], 10);

    if (req.user.id !== resourceUserId) {
      return res.status(403).json({
        success: false,
        message: 'Bu kaynağa erişim yetkiniz yok'
      });
    }

    next();
  };
};

module.exports = {
  authorize,
  requireSitter,
  requireOwner,
  requireOwnership
};
