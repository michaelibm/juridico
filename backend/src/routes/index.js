const express = require('express');
const router = express.Router();

const authRoutes    = require('./auth.routes');
const usuarioRoutes = require('./usuario.routes');
const processoRoutes = require('./processo.routes');
const dashboardRoutes = require('./dashboard.routes');
const logRoutes     = require('./log.routes');
const datajudRoutes = require('./datajud.routes');

router.use('/auth',      authRoutes);
router.use('/usuarios',  usuarioRoutes);
router.use('/processos', processoRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/logs',      logRoutes);
router.use('/datajud',   datajudRoutes);

module.exports = router;
