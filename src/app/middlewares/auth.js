const auth = (req, res, next) => {
  const { token } = req.query;
  const var_token = process.env.TOKEN;

  if (token !== var_token) {
    return res.status(401).json({ error: "Invalid Token." });
  }

  return next();
};

module.exports = auth;
