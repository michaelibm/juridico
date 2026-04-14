const axios = require('axios');
const logger = require('../utils/logger');

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

const dispararWebhook = async (tipoEvento, processo, movimentacao = null, usuario) => {
  if (!WEBHOOK_URL) {
    logger.warn('N8N_WEBHOOK_URL não configurado. Webhook ignorado.');
    return;
  }

  const agora = new Date();
  const payload = {
    evento: tipoEvento,
    id_processo: processo.id,
    numero_processo: processo.numeroProcesso,
    tipo_processo: processo.tipoProcesso,
    assunto: processo.assunto,
    status_atual: processo.status,
    prioridade: processo.prioridade,
    requerente: processo.requerente,
    setor_responsavel: processo.setorResponsavel,
    descricao_ultima_atualizacao: movimentacao?.descricao || processo.descricaoInicial,
    parecer: movimentacao?.parecer || null,
    tipo_movimentacao: movimentacao?.tipoMovimentacao || null,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      perfil: usuario.perfil,
    },
    data: agora.toLocaleDateString('pt-BR'),
    hora: agora.toLocaleTimeString('pt-BR'),
    timestamp: agora.toISOString(),
  };

  try {
    const response = await axios.post(WEBHOOK_URL, payload, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });
    logger.info(`✅ Webhook disparado [${tipoEvento}] para processo ${processo.numeroProcesso} - Status: ${response.status}`);
  } catch (err) {
    logger.error(`❌ Falha ao disparar webhook [${tipoEvento}] - Processo: ${processo.numeroProcesso} - Erro: ${err.message}`);
  }
};

module.exports = { dispararWebhook };
