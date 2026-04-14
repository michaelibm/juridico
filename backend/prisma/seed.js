const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  const adminExiste = await prisma.usuario.findUnique({
    where: { email: 'admin@juridico.com' },
  });

  if (!adminExiste) {
    const senhaHash = await bcrypt.hash('Admin@2024', 10);

    await prisma.usuario.create({
      data: {
        nome: 'Administrador do Sistema',
        email: 'admin@juridico.com',
        senhaHash,
        perfil: 'ADMINISTRADOR',
        ativo: true,
      },
    });

    console.log('✅ Usuário administrador criado: admin@juridico.com / Admin@2024');
  } else {
    console.log('ℹ️  Usuário administrador já existe.');
  }

  const juridico = await prisma.usuario.findUnique({
    where: { email: 'juridico@juridico.com' },
  });

  if (!juridico) {
    const senhaHash = await bcrypt.hash('Juridico@2024', 10);
    await prisma.usuario.create({
      data: {
        nome: 'Dr. Carlos Mendes',
        email: 'juridico@juridico.com',
        senhaHash,
        perfil: 'JURIDICO',
        ativo: true,
      },
    });
    console.log('✅ Usuário jurídico criado: juridico@juridico.com / Juridico@2024');
  }

  console.log('🎉 Seed concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed (não crítico):', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
