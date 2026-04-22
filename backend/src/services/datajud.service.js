const axios = require('axios');
const logger = require('../utils/logger');

const BASE_URL = process.env.DATAJUD_API_URL || 'https://api-publica.datajud.cnj.jus.br';
const API_KEY  = process.env.DATAJUD_API_KEY;

// Mapeia o tribunal para o índice correto da API
const INDICES = {
  // Superiores
  stf:    'api_publica_stf',
  stj:    'api_publica_stj',
  tst:    'api_publica_tst',
  tse:    'api_publica_tse',
  cjf:    'api_publica_cjf',
  csjt:   'api_publica_csjt',
  // Justiça Federal
  trf1:   'api_publica_trf1',
  trf2:   'api_publica_trf2',
  trf3:   'api_publica_trf3',
  trf4:   'api_publica_trf4',
  trf5:   'api_publica_trf5',
  trf6:   'api_publica_trf6',
  // Justiça do Trabalho
  trt1:   'api_publica_trt1',
  trt2:   'api_publica_trt2',
  trt3:   'api_publica_trt3',
  trt4:   'api_publica_trt4',
  trt5:   'api_publica_trt5',
  trt6:   'api_publica_trt6',
  trt7:   'api_publica_trt7',
  trt8:   'api_publica_trt8',
  trt9:   'api_publica_trt9',
  trt10:  'api_publica_trt10',
  trt11:  'api_publica_trt11',
  trt12:  'api_publica_trt12',
  trt13:  'api_publica_trt13',
  trt14:  'api_publica_trt14',
  trt15:  'api_publica_trt15',
  trt16:  'api_publica_trt16',
  trt17:  'api_publica_trt17',
  trt18:  'api_publica_trt18',
  trt19:  'api_publica_trt19',
  trt20:  'api_publica_trt20',
  trt21:  'api_publica_trt21',
  trt22:  'api_publica_trt22',
  trt23:  'api_publica_trt23',
  trt24:  'api_publica_trt24',
  // Justiça Eleitoral
  'tre-ac': 'api_publica_tre-ac',
  'tre-al': 'api_publica_tre-al',
  'tre-am': 'api_publica_tre-am',
  'tre-ap': 'api_publica_tre-ap',
  'tre-ba': 'api_publica_tre-ba',
  'tre-ce': 'api_publica_tre-ce',
  'tre-df': 'api_publica_tre-df',
  'tre-es': 'api_publica_tre-es',
  'tre-go': 'api_publica_tre-go',
  'tre-ma': 'api_publica_tre-ma',
  'tre-mg': 'api_publica_tre-mg',
  'tre-ms': 'api_publica_tre-ms',
  'tre-mt': 'api_publica_tre-mt',
  'tre-pa': 'api_publica_tre-pa',
  'tre-pb': 'api_publica_tre-pb',
  'tre-pe': 'api_publica_tre-pe',
  'tre-pi': 'api_publica_tre-pi',
  'tre-pr': 'api_publica_tre-pr',
  'tre-rj': 'api_publica_tre-rj',
  'tre-rn': 'api_publica_tre-rn',
  'tre-ro': 'api_publica_tre-ro',
  'tre-rr': 'api_publica_tre-rr',
  'tre-rs': 'api_publica_tre-rs',
  'tre-sc': 'api_publica_tre-sc',
  'tre-se': 'api_publica_tre-se',
  'tre-sp': 'api_publica_tre-sp',
  'tre-to': 'api_publica_tre-to',
  // Justiça Estadual
  tjsp:   'api_publica_tjsp',
  tjrj:   'api_publica_tjrj',
  tjmg:   'api_publica_tjmg',
  tjrs:   'api_publica_tjrs',
  tjpr:   'api_publica_tjpr',
  tjsc:   'api_publica_tjsc',
  tjba:   'api_publica_tjba',
  tjgo:   'api_publica_tjgo',
  tjpe:   'api_publica_tjpe',
  tjce:   'api_publica_tjce',
  tjam:   'api_publica_tjam',
  tjdf:   'api_publica_tjdf',
  tjmt:   'api_publica_tjmt',
  tjms:   'api_publica_tjms',
  tjpa:   'api_publica_tjpa',
  tjes:   'api_publica_tjes',
  tjma:   'api_publica_tjma',
  tjal:   'api_publica_tjal',
  tjse:   'api_publica_tjse',
  tjpi:   'api_publica_tjpi',
  tjrn:   'api_publica_tjrn',
  tjpb:   'api_publica_tjpb',
  tjro:   'api_publica_tjro',
  tjac:   'api_publica_tjac',
  tjap:   'api_publica_tjap',
  tjrr:   'api_publica_tjrr',
  tjto:   'api_publica_tjto',
};

const clienteHttp = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Authorization': API_KEY,
    'Content-Type': 'application/json',
  },
});

const consultarPorNumero = async (numeroProcesso, tribunal = 'trf1') => {
  const indice = INDICES[tribunal.toLowerCase()] || `api_publica_${tribunal.toLowerCase()}`;

  // Remove formatação do número para busca limpa
  const numeroLimpo = numeroProcesso.replace(/\D/g, '');

  const body = {
    query: {
      match: {
        numeroProcesso: numeroProcesso.trim(),
      },
    },
  };

  logger.info(`Consultando Datajud: ${indice} | Processo: ${numeroProcesso}`);

  const res = await clienteHttp.post(`/${indice}/_search`, body);
  return formatarResposta(res.data, tribunal);
};

const buscarAvancado = async ({ tribunal = 'trf1', numeroProcesso, nomePartes, assunto, dataInicio, dataFim, pagina = 1 }) => {
  const indice = INDICES[tribunal.toLowerCase()] || `api_publica_${tribunal.toLowerCase()}`;
  const from   = (pagina - 1) * 10;

  const must = [];

  if (numeroProcesso) {
    must.push({ match: { numeroProcesso: numeroProcesso.trim() } });
  }
  if (nomePartes) {
    must.push({ match: { 'partes.nome': nomePartes.trim() } });
  }
  if (assunto) {
    must.push({ match: { 'assuntos.nome': assunto.trim() } });
  }
  if (dataInicio || dataFim) {
    const range = { dataAjuizamento: {} };
    if (dataInicio) range.dataAjuizamento.gte = dataInicio;
    if (dataFim)    range.dataAjuizamento.lte = dataFim;
    must.push({ range });
  }

  const body = {
    query: must.length > 0 ? { bool: { must } } : { match_all: {} },
    from,
    size: 10,
    sort: [{ dataAjuizamento: { order: 'desc' } }],
  };

  logger.info(`Busca avançada Datajud: ${indice}`);

  const res = await clienteHttp.post(`/${indice}/_search`, body);
  return formatarResposta(res.data, tribunal);
};

const formatarResposta = (data, tribunal) => {
  const total  = data?.hits?.total?.value ?? 0;
  const hits   = data?.hits?.hits ?? [];

  const processos = hits.map(h => {
    const s = h._source;
    return {
      id:               h._id,
      numeroProcesso:   s.numeroProcesso,
      tribunal:         s.tribunal || tribunal.toUpperCase(),
      grau:             s.grau,
      classe:           s.classe?.nome,
      assuntos:         (s.assuntos || []).map(a => a.nome),
      orgaoJulgador:    s.orgaoJulgador?.nome,
      dataAjuizamento:  s.dataAjuizamento,
      status:           s.movimentos?.[0]?.nome || '—',
      partes:           (s.partes || []).map(p => ({
        nome:  p.nome,
        polo:  p.polo,
        tipo:  p.tipoPessoa,
      })),
      movimentos: (s.movimentos || [])
        .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
        .slice(0, 30)
        .map(m => ({
          data:        m.dataHora,
          descricao:   m.nome,
          complementos: (m.complementosTabelados || []).map(c => c.descricao),
        })),
    };
  });

  return { total, processos };
};

const listarTribunais = () => {
  return Object.keys(INDICES).map(sigla => ({
    sigla,
    indice: INDICES[sigla],
    label: sigla.toUpperCase(),
  }));
};

module.exports = { consultarPorNumero, buscarAvancado, listarTribunais };
