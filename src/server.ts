// src/server.ts
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { sensorRoutes } from './routes/sensor.routes.js'

const app = Fastify()

app.register(cors, { origin: true })

// ----------------------------------------------------
// ROTAS GERAIS DE INFRAESTRUTURA
// ----------------------------------------------------
app.get('/health', async () => {
  return { status: 'ok', message: 'Servidor AIoT online!' }
})

app.get('/ajuda', async () => {
  return {
    sistema: 'Rastreador AIoT de Chaves',
    versao: '1.0.0',
    instrucoes: 'Envie leituras para /api/sensor (POST) e consulte em /api/historico (GET).',
  }
})

// ----------------------------------------------------
// REGISTRO DE MÓDULOS DE ROTAS
// ----------------------------------------------------
app.register(sensorRoutes)

// ----------------------------------------------------
// INICIALIZAÇÃO DO SERVIDOR
// ----------------------------------------------------
const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' })
    console.log('🚀 Servidor rodando na porta 3000!')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()