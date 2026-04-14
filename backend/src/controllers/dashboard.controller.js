const dashboardService = require('../services/dashboard.service');

const obterResumo = async (req, res, next) => {
  try {
    const dados = await dashboardService.obterResumo();
    res.json(dados);
  } catch (err) { next(err); }
};

module.exports = { obterResumo };
