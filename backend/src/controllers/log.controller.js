const prisma = require('../config/database');

const listar = async (req, res, next) => {
  try {
    const { pagina = 1, limite = 20, entidade, acao, usuarioId } = req.query;
    const where = {};
    if (entidade) where.entidade = entidade;
    if (acao) where.acao = acao;
    if (usuarioId) where.usuarioId = usuarioId;

    const skip = (Number(pagina) - 1) * Number(limite);

    const [logs, total] = await Promise.all([
      prisma.logSistema.findMany({
        where,
        include: {
          usuario: { select: { id: true, nome: true, perfil: true } },
        },
        orderBy: { criadoEm: 'desc' },
        skip,
        take: Number(limite),
      }),
      prisma.logSistema.count({ where }),
    ]);

    res.json({
      logs,
      paginacao: {
        total,
        pagina: Number(pagina),
        limite: Number(limite),
        totalPaginas: Math.ceil(total / Number(limite)),
      },
    });
  } catch (err) { next(err); }
};

module.exports = { listar };
