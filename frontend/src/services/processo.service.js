import api from './api';

const listar = (filtros = {}) => {
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([k, v]) => { if (v) params.append(k, v); });
  return api.get(`/processos?${params.toString()}`);
};

const buscarPorId = (id) => api.get(`/processos/${id}`);

const criar = (dados) => api.post('/processos', dados);

const atualizar = (id, dados) => api.put(`/processos/${id}`, dados);

const excluir = (id) => api.delete(`/processos/${id}`);

const listarMovimentacoes = (processoId) =>
  api.get(`/processos/${processoId}/movimentacoes`);

const criarMovimentacao = (processoId, dados) =>
  api.post(`/processos/${processoId}/movimentacoes`, dados);

export default { listar, buscarPorId, criar, atualizar, excluir, listarMovimentacoes, criarMovimentacao };
