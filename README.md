# 📍 AIoT Key Tracker - Backend RTLS

Sistema de Ingestão e Monitorização em Tempo Real (**RTLS** - *Real-Time Location System*) para rastreamento indoor de ativos e objetos, utilizando gateways baseados em ESP32 (BLE) e backend desenvolvido em Node.js com Fastify.

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem:** TypeScript
- **Framework Web:** Fastify
- **ORM & Banco de Dados:** Prisma ORM, SQLite (Desenvolvimento local) / PostgreSQL (Produção)
- **Hardware Integrado:** ESP32 (Firmware C++ / Varredura BLE RSSI)
- **Ferramentas de Teste:** Dashboard HTML local (`index.html`) + Simulador CLI de Telemetria (`simulator.ts`)

---

## 🏗️ Arquitetura do Sistema

1. **Gateways (ESP32):** Realizam o scanning de Beacons BLE em segundo plano, capturando sinais de RSSI e enviando os pacotes HTTP/JSON para a API.
2. **API Backend (Fastify):** Processa as rotas em `/src/routes/sensor.routes.ts`, calculando a proximidade relativa dos ativos com base no nível de sinal (RSSI).
3. **Persistência (Prisma ORM):** Mapeia e armazena os registos de gateways, ativos e o histórico temporal de telemetrias.
4. **Simulador (`src/simulator.ts`):** Ferramenta integrada para simulação de envio de telemetria sem necessidade de hardware físico ligado durante o desenvolvimento.

---

## 📁 Estrutura do Projeto

```text
aiot-key-tracker-backend-01/
├── prisma/
│   ├── migrations/       # Histórico de migrações da base de dados
│   ├── schema.prisma     # Mapeamento de tabelas/entidades do Prisma
│   ├── prisma.config.ts  # Configurações do ambiente do Prisma
│   └── seed.ts           # População inicial para testes
├── src/
│   ├── lib/
│   │   └── prisma.ts     # Instância e cliente do Prisma ORM
│   ├── routes/
│   │   └── sensor.routes.ts # Rotas de ingestão de dados BLE
│   ├── server.ts         # Ponto de entrada do servidor Fastify
│   └── simulator.ts      # Simulador CLI de sinais RSSI
├── index.html            # Dashboard visual simples para testes locais
├── package.json
└── tsconfig.json

🚀 Como Executar o Projeto
1. Clonar o Repositório e Instalar Dependências
git clone [https://github.com/SEU-USUARIO/aiot-key-tracker-backend.git](https://github.com/SEU-USUARIO/aiot-key-tracker-backend.git)
cd aiot-key-tracker-backend
npm install

2. Configurar Variáveis de Ambiente
Crie um ficheiro .env na raiz do projeto contendo as seguintes variáveis:
DATABASE_URL="file:./dev.db"
PORT=3000

3. Executar as Migrações do Banco de Dados
npx prisma migrate dev
npx prisma db seed

4. Iniciar o Servidor
# Modo de Desenvolvimento (Hot Reloading)
npm run dev

# Executar o Simulador de Telemetria (Em outro terminal)
npx ts-node src/simulator.ts

📌 Funcionalidades Principais
[x] Ingestão em alta performance de dados de sensores BLE via HTTP Fastify.

[x] Processamento e categorização do RSSI por Gateway/Ativo.

[x] Modelagem relacional robusta via Prisma ORM.

[x] Ferramentas de desenvolvimento integradas (Simulador CLI + Teste Visual HTML).