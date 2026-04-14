const processoService = require('../services/processo.service');

const listar = async (req, res, next) => {
  try {
    const resultado = await processoService.listar(req.query);
    res.json(resultado);
  } catch (err) { next(err); }
};

const buscarPorId = async (req, res, next) => {
  try {
    const processo = await processoService.buscarPorId(req.params.id);
    res.json(processo);
  } catch (err) { next(err); }
};

const criar = async (req, res, next) => {
  try {
    const processo = await processoService.criar(req.body, req.usuario);
    res.status(201).json(processo);
  } catch (err) { next(err); }
};

const atualizar = async (req, res, next) => {
  try {
    const processo = await processoService.atualizar(req.params.id, req.body, req.usuario);
    res.json(processo);
  } catch (err) { next(err); }
};

const excluir = async (req, res, next) => {
  try {
    await processoService.excluir(req.params.id, req.usuario);
    res.json({ mensagem: 'Processo excluído com sucesso.' });
  } catch (err) { next(err); }
};

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
