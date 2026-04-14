const prisma = require('../config/database');
const { registrarLog } = require('./log.service');
const { dispararWebhook } = require('./webhook.service');

const listarPorProcesso = async (processoId) => {
  return prisma.movimentacaoProcesso.findMany({
    where: { processoId },
    include: {
      usuario: { select: { id: true, nome: true, perfil: true } },
    },
    orderBy: { criadoEm: 'asc' },
  });
};

const criar = async (processoId, dados, usuarioLogado) => {
  const processo = await prisma.processo.findFirst({
    where: { id: processoId, ativo: true },
  });

  if (!processo) {
    const err = new Error('Processo não encontrado.');
    err.status = 404;
    throw err;
  }

  const { tipoMovimentacao, descricao, parecer, statusNovo } = dados;

  const statusAnterior = processo.status;
  let novoStatus = processo.status;

  if (statusNovo && statusNovo !== statusAnterior) {
    novoStatus = statusNovo;
    await prisma.processo.update({
      where: { id: processoId },
      data: { status: statusNovo },
    });
  }

  const movimentacao = await prisma.movimentacaoProcesso.create({
    data: {
      processoId,
      tipoMovimentacao,
      descricao,
      parecer: parecer || null,
      statusAnterior: statusNovo ? statusAnterior : null,
      statusNovo: statusNovo || null,
      criadoPor: usuarioLogado.id,
    },
    include: {
      usuario: { select: { id: true, nome: true, perfil: true } },
    },
  });

  await registrarLog({
    usuarioId: usuarioLogado.id,
    acao: 'NOVA_MOVIMENTACAO',
    entidade: 'movimentacoes_processo',
    entidadeId: movimentacao.id,
    detalhes: {
      processo_id: processoId,
      tipo: tipoMovimentacao,
      status_anterior: statusAnterior,
      status_novo: novoStatus,
    },
  });

  const processoAtualizado = await prisma.processo.findUnique({ where: { id: processoId } });

  const tipoEvento = tipoMovimentacao === 'PARECER'
    ? 'parecer'
    : statusNovo && statusNovo !== statusAnterior
      ? 'status_alterado'
      : 'atualizado';

  dispararWebhook(tipoEvento, processoAtualizado, movimentacao, usuarioLogado);

  return movimentacao;
};

module.exports = { listarPorProcesso, criar };
