const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.path}`);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ erro: err.message });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({ erro: 'Registro duplicado. Verifique os dados informados.' });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ erro: 'Registro não encontrado.' });
  }

  return res.status(err.status || 500).json({
    erro: err.message || 'Erro interno do servidor.',
  });
};

module.exports = errorMiddleware;
