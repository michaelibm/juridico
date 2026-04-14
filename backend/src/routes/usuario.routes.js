const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { autenticar } = require('../middlewares/auth.middleware');
const { autorizar } = require('../middlewares/permission.middleware');

router.use(autenticar);

router.get('/', autorizar('ADMINISTRADOR'), usuarioController.listar);
router.get('/:id', autorizar('ADMINISTRADOR'), usuarioController.buscarPorId);
router.post('/', autorizar('ADMINISTRADOR'), usuarioController.criar);
router.put('/:id', autorizar('ADMINISTRADOR'), usuarioController.atualizar);
router.delete('/:id', autorizar('ADMINISTRADOR'), usuarioController.desativar);

module.exports = router;
