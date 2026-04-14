const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { autenticar } = require('../middlewares/auth.middleware');

router.get('/', autenticar, dashboardController.obterResumo);

module.exports = router;
