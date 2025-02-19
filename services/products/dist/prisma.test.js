"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const users = await prisma.users.findMany();
    console.log(users);
}
main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=prisma.test.js.map