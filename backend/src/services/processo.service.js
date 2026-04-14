const prisma = require('../config/database');
const { registrarLog } = require('./log.service');
const { dispararWebhook } = require('./webhook.service');

const listar = async (filtros = {}) => {
  const {
    numeroProcesso, tipoProcesso, assunto, status, prioridade,
    requerente, setorResponsavel, criadoPor, dataInicio, dataFim,
    atualizadoInicio, atualizadoFim, pagina = 1, limite = 15, ordem = 'desc',
  } = filtros;

  const where = { ativo: true };

  if (numeroProcesso) where.numeroProcesso = { contains: numeroProcesso, mode: 'insensitive' };
  if (tipoProcesso) where.tipoProcesso = tipoProcesso;
  if (assunto) where.assunto = { contains: assunto, mode: 'insensitive' };
  if (status) where.status = status;
  if (prioridade) where.prioridade = prioridade;
  if (requerente) where.requerente = { contains: requerente, mode: 'insensitive' };
  if (setorResponsavel) where.setorResponsavel = { contains: setorResponsavel, mode: 'insensitive' };
  if (criadoPor) where.criadoPor = criadoPor;
  if (dataInicio || dataFim) {
    where.dataAbertura = {};
    if (dataInicio) where.dataAbertura.gte = new Date(dataInicio);
    if (dataFim) where.dataAbertura.lte = new Date(dataFim);
  }
  if (atualizadoInicio || atualizadoFim) {
    where.atualizadoEm = {};
    if (atualizadoInicio) where.atualizadoEm.gte = new Date(atualizadoInicio);
    if (atualizadoFim) where.atualizadoEm.lte = new Date(atualizadoFim);
  }

  const skip = (Number(pagina) - 1) * Number(limite);

  const [processos, total] = await Promise.all([
    prisma.processo.findMany({
      where,
      include: {
        usuario: { select: { id: true, nome: true, perfil: true } },
        _count: { select: { movimentacoes: true } },
      },
      orderBy: { criadoEm: ordem === 'asc' ? 'asc' : 'desc' },
      skip,
      take: Number(limite),
    }),
    prisma.processo.count({ where }),
  ]);

  return {
    processos,
    paginacao: {
      total,
      pagina: Number(pagina),
      limite: Number(limite),
      totalPaginas: Math.ceil(total / Number(limite)),
    },
  };
};

const buscarPorId = async (id) => {
  const processo = await prisma.processo.findFirst({
    where: { id, ativo: true },
    include: {
      usuario: { select: { id: true, nome: true, perfil: true } },
      movimentacoes: {
        include: {
          usuario: { select: { id: true, nome: true, perfil: true } },
        },
        orderBy: { criadoEm: 'asc' },
      },
    },
  });

  if (!processo) {
    const err = new Error('Processo não encontrado.');
    err.status = 404;
    throw err;
  }

  return processo;
};

const criar = async (dados, usuarioLogado) => {
  const processo = await prisma.processo.create({
    data: {
      ...dados,
      criadoPor: usuarioLogado.id,
      dataAbertura: new Date(dados.dataAbertura),
    },
    include: {
      usuario: { select: { id: true, nome: true, perfil: true } },
    },
  });

  await registrarLog({
    usuarioId: usuarioLogado.id,
    acao: 'CRIACAO',
    entidade: 'processos',
    entidadeId: processo.id,
    detalhes: { numero: processo.numeroProcesso, tipo: processo.tipoProcesso },
  });

  dispararWebhook('criado', processo, null, usuarioLogado);

  return processo;
};

const atualizar = async (id, dados, usuarioLogado) => {
  const processoAtual = await prisma.processo.findFirst({ where: { id, ativo: true } });
  if (!processoAtual) {
    const err = new Error('Processo não encontrado.');
    err.status = 404;
    throw err;
  }

  const atualizado = await prisma.processo.update({
    where: { id },
    data: dados,
    include: {
      usuario: { select: { id: true, nome: true, perfil: true } },
    },
  });

  await registrarLog({
    usuarioId: usuarioLogado.id,
    acao: 'EDICAO',
    entidade: 'processos',
    entidadeId: id,
    detalhes: { campos_alterados: Object.keys(dados) },
  });

  const tipoEvento = dados.status && dados.status !== processoAtual.status
    ? 'status_alterado'
    : 'atualizado';

  dispararWebhook(tipoEvento, atualizado, null, usuarioLogado);

  return atualizado;
};

const excluir = async (id, usuarioLogado) => {
  await prisma.processo.update({
    where: { id },
    data: { ativo: false },
  });

  await registrarLog({
    usuarioId: usuarioLogado.id,
    acao: 'EXCLUSAO_LOGICA',
    entidade: 'processos',
    entidadeId: id,
  });
};

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
