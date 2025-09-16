import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Tentando conectar ao banco de dados...');
        await prisma.$connect();
        console.log('✅ Conexão bem-sucedida!');
    } catch (error) {
        console.error('❌ Falha na conexão:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
