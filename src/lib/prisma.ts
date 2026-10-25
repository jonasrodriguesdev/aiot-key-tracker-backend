import 'dotenv/config' // <-- Carrega o arquivo .env automaticamente
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error("Database_url nao foi definida no arquivo .env")
}

// 1. Cria a pool de conexões do PostgreSQL usando a variável do .env
const pool = new Pool({ connectionString })

// 2. Instancia o adaptador oficial do PostgreSQL para o Prisma 7
const adapter = new PrismaPg(pool)

// 3. Exporta a instância única (Singleton) que será usada na aplicação inteira
export const prisma = new PrismaClient({ adapter })