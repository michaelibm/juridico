const movimentacaoService = require('../services/movimentacao.service');

const listar = async (req, res, next) => {
  try {
    const movimentacoes = await movimentacaoService.listarPorProcesso(req.params.processoId);
    res.json(movimentacoes);
  } catch (err) { next(err); }
};

const criar = async (req, res, next) => {
  try {
    const movimentacao = await movimentacaoService.criar(
      req.params.processoId,
      req.body,
      req.usuario
    );
    res.status(201).json(movimentacao);
  } catch (err) { next(err); }
};

module.exports = { listar, criar };
