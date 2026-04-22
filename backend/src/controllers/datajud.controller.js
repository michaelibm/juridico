const datajudService = require('../services/datajud.service');

const consultarPorNumero = async (req, res, next) => {
  try {
    const { numeroProcesso, tribunal = 'trf1' } = req.query;
    if (!numeroProcesso) {
      return res.status(400).json({ erro: 'Número do processo é obrigatório.' });
    }
    const resultado = await datajudService.consultarPorNumero(numeroProcesso, tribunal);
    res.json(resultado);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json({
        erro: 'Erro ao consultar API Datajud.',
        detalhe: err.response.data?.error?.reason || err.message,
      });
    }
    next(err);
  }
};

const buscarAvancado = async (req, res, next) => {
  try {
    const resultado = await datajudService.buscarAvancado(req.query);
    res.json(resultado);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json({
        erro: 'Erro ao consultar API Datajud.',
        detalhe: err.response.data?.error?.reason || err.message,
      });
    }
    next(err);
  }
};

const listarTribunais = (req, res) => {
  res.json(datajudService.listarTribunais());
};

module.exports = { consultarPorNumero, buscarAvancado, listarTribunais };
