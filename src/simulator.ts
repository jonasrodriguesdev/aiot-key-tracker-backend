// Lista de cômodos da casa por onde a chave pode andar
const comodos = ['Sala de Estar', 'Cozinha', 'Quarto Principal', 'Escritório', 'Banheiro', 'Corredor', 'Varanda']

function gerarIntensidadeSinal() {
  // O sinal BLE (RSSI) varia geralmente entre -30 (muito perto) e -90 (muito longe)
  return Math.floor(Math.random() * (-30 - (-90) + 1)) + (-90)
}

// inicio de bateria nivel
let bateriaAtual = 100;

async function enviarLeituraSensor() {
  // Escolhe um cômodo aleatório da lista
  const comodoAtual = comodos[Math.floor(Math.random() * comodos.length)]
  const rssiAtual = gerarIntensidadeSinal()

  if (bateriaAtual > 15) {
    bateriaAtual -= 1;
  } else {
    bateriaAtual = 100;
  }

  const payload = {
    tagId: 'AA:BB:CC:DD:EE:FF', // <-- Usando o MAC address real da iTag do seed
    comodo: comodoAtual,
    rssi: rssiAtual,
    bateria: bateriaAtual,
    timestamp: new Date().toISOString()
  }

  try {
    const resposta = await fetch('http://localhost:3000/api/sensor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (resposta.ok) {
      console.log(`✅ [Simulador] Evento enviado: Chave na ${comodoAtual} (RSSI: ${rssiAtual} | Bat: ${bateriaAtual}%)`)
    } else {
      console.error('❌ [Simulador] Erro ao enviar leitura para o servidor')
    }
  } catch (erro) {
    console.error('⚠️ [Simulador] Servidor offline ou inacessível no momento.')
  }
}

console.log('🤖 Simulador de Sensor BLE iniciado. Enviando dados a cada 5 segundos...')

// Executa o envio a cada 5 segundos (5000ms)
setInterval(enviarLeituraSensor, 10000)