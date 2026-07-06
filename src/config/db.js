const { PrismaClient } = require("@prisma/client"); //imports Prisma DB client 

const prisma = new PrismaClient(); //creates an instance

module.exports = prisma;