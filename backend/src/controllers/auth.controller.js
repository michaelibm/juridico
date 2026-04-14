const authService = require('../services/auth.service');

const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }
    const resultado = await authService.login({ email, senha });
    res.json(resultado);
  } catch (err) {
    next(err);
  }
};

const me = async (req, res) => {
  res.json({ usuario: req.usuario });
};

module.exports = { login, me };
