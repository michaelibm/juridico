import api from './api';

const consultar = (numeroProcesso, tribunal = 'trf1') =>
  api.get('/datajud/consultar', { params: { numeroProcesso, tribunal } });

const buscarAvancado = (params) =>
  api.get('/datajud/buscar', { params });

const listarTribunais = () =>
  api.get('/datajud/tribunais');

export default { consultar, buscarAvancado, listarTribunais };
