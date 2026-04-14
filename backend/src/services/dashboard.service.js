const prisma = require('../config/database');

const obterResumo = async () => {
  const [
    total,
    porTipo,
    porStatus,
    porPrioridade,
    recentes,
    ultimasMovimentacoes,
  ] = await Promise.all([
    prisma.processo.count({ where: { ativo: true } }),

    prisma.processo.groupBy({
      by: ['tipoProcesso'],
      where: { ativo: true },
      _count: { tipoProcesso: true },
    }),

    prisma.processo.groupBy({
      by: ['status'],
      where: { ativo: true },
      _count: { status: true },
    }),

    prisma.processo.groupBy({
      by: ['prioridade'],
      where: { ativo: true },
      _count: { prioridade: true },
    }),

    prisma.processo.findMany({
      where: { ativo: true },
      include: {
        usuario: { select: { nome: true } },
      },
      orderBy: { criadoEm: 'desc' },
      take: 8,
    }),

    prisma.movimentacaoProcesso.findMany({
      include: {
        usuario: { select: { nome: true } },
        processo: { select: { numeroProcesso: true, assunto: true } },
      },
      orderBy: { criadoEm: 'desc' },
      take: 8,
    }),
  ]);

  const prioritarios = await prisma.processo.findMany({
    where: {
      ativo: true,
      prioridade: { in: ['ALTA', 'URGENTE'] },
      status: { notIn: ['CONCLUIDO', 'ARQUIVADO', 'CANCELADO'] },
    },
    include: {
      usuario: { select: { nome: true } },
    },
    orderBy: [
      { prioridade: 'desc' },
      { criadoEm: 'asc' },
    ],
    take: 5,
  });

  return {
    total,
    porTipo: porTipo.reduce((acc, item) => {
      acc[item.tipoProcesso] = item._count.tipoProcesso;
      return acc;
    }, {}),
    porStatus: porStatus.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {}),
    porPrioridade: porPrioridade.reduce((acc, item) => {
      acc[item.prioridade] = item._count.prioridade;
      return acc;
    }, {}),
    recentes,
    ultimasMovimentacoes,
    prioritarios,
  };
};

module.exports = { obterResumo };
