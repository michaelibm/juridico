const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { registrarLog } = require('./log.service');

const listar = async () => {
  return prisma.usuario.findMany({
    select: {
      id: true, nome: true, email: true, perfil: true,
      ativo: true, criadoEm: true, atualizadoEm: true,
    },
    orderBy: { nome: 'asc' },
  });
};

const buscarPorId = async (id) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: {
      id: true, nome: true, email: true, perfil: true,
      ativo: true, criadoEm: true, atualizadoEm: true,
    },
  });
  if (!usuario) {
    const err = new Error('Usuário não encontrado.');
    err.status = 404;
    throw err;
  }
  return usuario;
};

const criar = async (dados, usuarioLogadoId) => {
  const { nome, email, senha, perfil } = dados;

  const existe = await prisma.usuario.findUnique({ where: { email } });
  if (existe) {
    const err = new Error('E-mail já cadastrado.');
    err.status = 409;
    throw err;
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const novo = await prisma.usuario.create({
    data: { nome, email, senhaHash, perfil: perfil || 'CONSULTA' },
    select: {
      id: true, nome: true, email: true, perfil: true,
      ativo: true, criadoEm: true,
    },
  });

  await registrarLog({
    usuarioId: usuarioLogadoId,
    acao: 'CRIACAO',
    entidade: 'usuarios',
    entidadeId: novo.id,
    detalhes: { nome: novo.nome, email: novo.email, perfil: novo.perfil },
  });

  return novo;
};

const atualizar = async (id, dados, usuarioLogadoId) => {
  const { nome, email, perfil, ativo, senha } = dados;

  const updateData = {};
  if (nome) updateData.nome = nome;
  if (email) updateData.email = email;
  if (perfil) updateData.perfil = perfil;
  if (ativo !== undefined) updateData.ativo = ativo;
  if (senha) updateData.senhaHash = await bcrypt.hash(senha, 10);

  const atualizado = await prisma.usuario.update({
    where: { id },
    data: updateData,
    select: {
      id: true, nome: true, email: true, perfil: true,
      ativo: true, criadoEm: true, atualizadoEm: true,
    },
  });

  await registrarLog({
    usuarioId: usuarioLogadoId,
    acao: 'EDICAO',
    entidade: 'usuarios',
    entidadeId: id,
    detalhes: { campos_alterados: Object.keys(updateData) },
  });

  return atualizado;
};

const desativar = async (id, usuarioLogadoId) => {
  const atualizado = await prisma.usuario.update({
    where: { id },
    data: { ativo: false },
  });

  await registrarLog({
    usuarioId: usuarioLogadoId,
    acao: 'DESATIVACAO',
    entidade: 'usuarios',
    entidadeId: id,
  });

  return atualizado;
};

module.exports = { listar, buscarPorId, criar, atualizar, desativar };
