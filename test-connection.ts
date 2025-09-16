import { PrismaClient, QuestionLanguage } from '@prisma/client';
const prisma = new PrismaClient();

async function createQuestion() {
    console.log('Criando uma nova pergunta...');
    try {
        const newQuestion = await prisma.question.create({
            data: {
                normalQuestion: 'Qual maior atleta de todos os tempos?',
                impostorQuestion: 'Qual um atleta que você acha superestimado?',
                language: QuestionLanguage.PORTUGUESE,
            },
        });
        console.log('✅ Pergunta criada com sucesso:', newQuestion);
    } catch (error) {
        console.error('❌ Falha ao criar pergunta:', error);
    }
}

async function main() {
    try {
        console.log('Tentando conectar ao banco de dados...');
        await prisma.$connect();
        console.log('✅ Conexão bem-sucedida!');

        console.log('Buscando uma sala de jogo para validar o schema...');
        const gameRoom = await prisma.gameRoom.findFirst();

        if (gameRoom) {
            console.log('✅ Schema validado com sucesso:', gameRoom);
        } else {
            console.log(
                '🟡 Não foram encontradas salas de jogo, mas o schema parece correto.',
            );
        }

        await createQuestion();
    } catch (error) {
        console.error('❌ Falha na conexão:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
