// src/routes/sensor.routes.ts
import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'

export async function sensorRoutes(app: FastifyInstance) {
  // ROTA 1: Recebe e salva a leitura no banco
  app.post('/api/sensor', async (request, reply) => {
    try {
      const body = request.body as {
        tagId: string
        comodo: string
        rssi: number
        bateria?: number
        timestamp?: string
      }

      const novaLeitura = await prisma.leituraSensor.create({
        data: {
          tagId: body.tagId,
          comodo: body.comodo,
          rssi: body.rssi,
          bateria: body.bateria ?? 100,
          timestamp: body.timestamp ? new Date(body.timestamp) : new Date()
        },
      })

      console.log(`📡 [REGISTRADO #${novaLeitura.id}] Chave '${novaLeitura.tagId}' na ${novaLeitura.comodo} (${novaLeitura.rssi} dBm)`)

      return reply.status(201).send({
        sucesso: true, 
        dados: novaLeitura
      })
    } catch (error) {
      console.error('Erro ao salvar no banco:', error)
      return reply.status(500).send({
        sucesso: false,
        erro: 'Falha ao salvar a leitura do sensor'
      })
    }
  })

  // ROTA 2: Retorna o histórico de leituras
  app.get('/api/historico', async (request, reply) => {
    try {
      const leituras = await prisma.leituraSensor.findMany({
        take: 50,
        orderBy: {
          id: 'desc',
        }
      })
      
      const totalRegistros = await prisma.leituraSensor.count()
      
      return reply.send({
        sucesso: true, 
        dados: leituras,
        total: totalRegistros
      })
    } catch (error) {
      console.error('Erro ao buscar histórico:', error)
      return reply.status(500).send({
        sucesso: false, 
        erro: 'Falha ao buscar histórico do banco de dados'
      })
    }
  })

  app.get('/api/targets', async (request, reply) => {
    try {
      const { nodeId } = request.query as { nodeId?: string }

      if (!nodeId) {
        return reply.status(400).send({ sucesso: false, erro: 'nodeId é obrigatório' })
      }

      // 1. Localiza o nó e descobre a qual empresa ele pertence
      const node = await prisma.node.findUnique({
        where: { id: nodeId },
        include: { company: true }
      })

      if (!node) {
        return reply.status(404).send({ sucesso: false, erro: 'Node não encontrado' })
      }

      // 2. Busca todas as Tags cadastradas para essa mesma empresa
      const tagsDaEmpresa = await prisma.tag.findMany({
        where: { companyId: node.companyId },
        select: { id: true } // O id da Tag é o MAC address (ex: "AA:BB:CC...")
      })

      const targets = tagsDaEmpresa.map(t => t.id)

      return reply.send({
        sucesso: true,
        targets,
        scanIntervalMs: 1000
      })
    } catch (error) {
      console.error('Erro ao buscar targets:', error)
      return reply.status(500).send({ sucesso: false, erro: 'Falha interna ao buscar alvos' })
    }
  })

  // ROTA DE BOOTSTRAP: O ESP32 pergunta quem ele é usando seu MAC address
  app.get('/api/nodes/bootstrap', async (request, reply) => {
    try {
      const { mac } = request.query as { mac?: string }

      if (!mac) {
        return reply.status(400).send({ sucesso: false, erro: 'MAC address do ESP32 é obrigatório' })
      }

      // 1. Procura o nó no banco pelo MAC
      const node = await prisma.node.findUnique({
        where: { id: mac },
        include: { company: true }
      })

      if (!node) {
        // Se não encontrar, retorna 404 para o ESP32 saber que precisa ser cadastrado no painel
        return reply.status(404).send({ 
          sucesso: false, 
          erro: 'ESP32 não reconhecido. Cadastre este MAC no sistema.' 
        })
      }

      // 2. Busca todas as tags da mesma empresa para montar a whitelist
      const tagsDaEmpresa = await prisma.tag.findMany({
        where: { companyId: node.companyId },
        select: { id: true }
      })

      const targets = tagsDaEmpresa.map(t => t.id)

      return reply.send({
        sucesso: true,
        nodeId: node.id,
        locationName: node.locationName,
        companyName: node.company.name,
        targets,
        scanIntervalMs: 1000
      })

    } catch (error) {
      console.error('Erro no bootstrap do ESP32:', error)
      return reply.status(500).send({ sucesso: false, erro: 'Falha interna no bootstrap' })
    }
  })

}