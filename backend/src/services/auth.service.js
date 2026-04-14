const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { gerarToken } = require('../utils/jwt.utils');
const { registrarLog } = require('./log.service');

const login = async ({ email, senha }) => {
  const usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario || !usuario.ativo) {
    const err = new Error('E-mail ou senha inválidos.');
    err.status = 401;
    throw err;
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
  if (!senhaValida) {
    const err = new Error('E-mail ou senha inválidos.');
    err.status = 401;
    throw err;
  }

  const token = gerarToken({
    id: usuario.id,
    email: usuario.email,
    perfil: usuario.perfil,
  });

  await registrarLog({
    usuarioId: usuario.id,
    acao: 'LOGIN',
    entidade: 'usuarios',
    entidadeId: usuario.id,
    detalhes: { ip: null },
  });

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
    },
  };
};

module.exports = { login };
