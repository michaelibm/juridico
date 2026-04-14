const express = require('express');
const router = express.Router();
const logController = require('../controllers/log.controller');
const { autenticar } = require('../middlewares/auth.middleware');
const { autorizar } = require('../middlewares/permission.middleware');

router.get('/', autenticar, autorizar('ADMINISTRADOR'), logController.listar);

module.exports = router;
