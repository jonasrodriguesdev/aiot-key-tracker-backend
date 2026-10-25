import { prisma } from '../src/lib/prisma' // Ajuste o caminho conforme onde está o seu arquivo
import 'dotenv/config'
 console.log('começo do arquivo')
async function main() {
  console.log('🌱 Iniciando o seed do banco de dados...')

  // Limpa dados antigos respeitando as chaves estrangeiras
  await prisma.locationLog.deleteMany()
  await prisma.asset.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.node.deleteMany()
  await prisma.company.deleteMany()

  // 1. Criar uma Empresa (Tenant)
  const empresa = await prisma.company.create({
    data: {
      name: 'Logística Alpha Ltda',
    },
  })
  console.log(`🏢 Empresa criada: ${empresa.name} (${empresa.id})`)

  // 2. Criar um Nó ESP32
  const node = await prisma.node.create({
    data: {
      id: 'ESP32_SALA_01',
      locationName: 'Sala de Expedição',
      companyId: empresa.id,
    },
  })
  console.log(`📡 Nó ESP32 criado: ${node.id}`)

  // 3. Criar uma iTag BLE física
  const macDoSeuCelularOuTag = 'AA:BB:CC:DD:EE:FF' 
  const tag = await prisma.tag.create({
    data: {
      id: macDoSeuCelularOuTag,
      name: 'iTag Chaveiro 01',
      companyId: empresa.id,
    },
  })
  console.log(`🏷️ Tag BLE criada: ${tag.id}`)

  // 4. Criar o Ativo associado à Tag
  const asset = await prisma.asset.create({
    data: {
      name: 'Chave do Carrinho Elétrico',
      companyId: empresa.id,
      tagId: tag.id,
    },
  })
  console.log(`📦 Ativo criado: ${asset.name} vinculado à tag ${tag.id}`)

  console.log('✅ Seed finalizado com sucesso!')
}
console.log('URL do Banco sendo usada:', process.env.DATABASE_URL)
// GATILHO DIRETO: Chama a função imediatamente ao ler o arquivo
main()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.error('💥 ERRO:', err)
    process.exit(1)
  })