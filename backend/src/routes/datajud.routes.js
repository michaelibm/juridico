const express = require('express');
const router  = express.Router();
const datajudController = require('../controllers/datajud.controller');
const { autenticar } = require('../middlewares/auth.middleware');

router.use(autenticar);

router.get('/consultar',  datajudController.consultarPorNumero);
router.get('/buscar',     datajudController.buscarAvancado);
router.get('/tribunais',  datajudController.listarTribunais);

module.exports = router;
