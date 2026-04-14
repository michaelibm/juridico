import api from './api';

const listar = () => api.get('/usuarios');
const buscarPorId = (id) => api.get(`/usuarios/${id}`);
const criar = (dados) => api.post('/usuarios', dados);
const atualizar = (id, dados) => api.put(`/usuarios/${id}`, dados);
const desativar = (id) => api.delete(`/usuarios/${id}`);

export default { listar, buscarPorId, criar, atualizar, desativar };
