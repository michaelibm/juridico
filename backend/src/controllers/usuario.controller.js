const usuarioService = require('../services/usuario.service');

const listar = async (req, res, next) => {
  try {
    const usuarios = await usuarioService.listar();
    res.json(usuarios);
  } catch (err) { next(err); }
};

const buscarPorId = async (req, res, next) => {
  try {
    const usuario = await usuarioService.buscarPorId(req.params.id);
    res.json(usuario);
  } catch (err) { next(err); }
};

const criar = async (req, res, next) => {
  try {
    const novo = await usuarioService.criar(req.body, req.usuario.id);
    res.status(201).json(novo);
  } catch (err) { next(err); }
};

const atualizar = async (req, res, next) => {
  try {
    const atualizado = await usuarioService.atualizar(req.params.id, req.body, req.usuario.id);
    res.json(atualizado);
  } catch (err) { next(err); }
};

const desativar = async (req, res, next) => {
  try {
    await usuarioService.desativar(req.params.id, req.usuario.id);
    res.json({ mensagem: 'Usuário desativado com sucesso.' });
  } catch (err) { next(err); }
};

module.exports = { listar, buscarPorId, criar, atualizar, desativar };
