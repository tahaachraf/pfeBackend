module.exports = (rolesAutorises = []) => {
  return (req, res, next) => {
    if (!rolesAutorises.includes(req.user.statut)) {
      return res.status(403).json({
        message: "Accès interdit : permissions insuffisantes"
      });
    }
    next();
  };
};
