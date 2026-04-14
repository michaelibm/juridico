import api from './api';

const obterResumo = () => api.get('/dashboard');

export default { obterResumo };
