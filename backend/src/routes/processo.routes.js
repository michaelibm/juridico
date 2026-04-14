const express = require('express');
const router = express.Router();
const processoController = require('../controllers/processo.controller');
const movimentacaoController = require('../controllers/movimentacao.controller');
const { autenticar } = require('../middlewares/auth.middleware');
const { autorizar } = require('../middlewares/permission.middleware');

router.use(autenticar);

const PODE_EDITAR = ['ADMINISTRADOR', 'JURIDICO', 'ADMINISTRATIVO'];
const TODOS = ['ADMINISTRADOR', 'JURIDICO', 'ADMINISTRATIVO', 'CONSULTA'];

router.get('/', autorizar(...TODOS), processoController.listar);
router.get('/:id', autorizar(...TODOS), processoController.buscarPorId);
router.post('/', autorizar(...PODE_EDITAR), processoController.criar);
router.put('/:id', autorizar(...PODE_EDITAR), processoController.atualizar);
router.delete('/:id', autorizar('ADMINISTRADOR'), processoController.excluir);

// Movimentações
router.get('/:processoId/movimentacoes', autorizar(...TODOS), movimentacaoController.listar);
router.post('/:processoId/movimentacoes', autorizar(...PODE_EDITAR), movimentacaoController.criar);

module.exports = router;
