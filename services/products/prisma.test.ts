import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.users.findMany(); // Ajusta según tus modelos
    console.log(users);
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
