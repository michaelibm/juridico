const prisma = require('../config/database');
const logger = require('../utils/logger');

const registrarLog = async ({ usuarioId, acao, entidade, entidadeId = null, detalhes = null }) => {
  try {
    await prisma.logSistema.create({
      data: {
        usuarioId,
        acao,
        entidade,
        entidadeId,
        detalhes,
      },
    });
  } catch (err) {
    logger.error(`Falha ao registrar log: ${err.message}`);
  }
};

module.exports = { registrarLog };
