const { verificarToken } = require('../utils/jwt.utils');
const prisma = require('../config/database');

const autenticar = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token de autenticação não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verificarToken(token);
    const usuario = await prisma.usuario.findUnique({
      where: { id: payload.id },
      select: { id: true, nome: true, email: true, perfil: true, ativo: true },
    });

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ erro: 'Usuário inativo ou não encontrado.' });
    }

    req.usuario = usuario;
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
};

module.exports = { autenticar };
