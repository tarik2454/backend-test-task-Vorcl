const fs = require('fs');
const fastifyWebsocket = require('@fastify/websocket');

// Функция преобразования Float32Array в PCM16
function floatTo16BitPCM(float32Array) {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

// Функция преобразования Float32Array в Base64 PCM16
function base64EncodeAudio(float32Array) {
  const arrayBuffer = floatTo16BitPCM(float32Array);
  let binary = '';
  const bytes = new Uint8Array(arrayBuffer);
  const chunkSize = 0x8000; // 32KB
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }
  return Buffer.from(binary, 'binary').toString('base64');
}

module.exports = async fastify => {
  fastify.register(fastifyWebsocket);

  fastify.get('/ws', { websocket: true }, (connection, req) => {
    console.log('Клиент подключился');

    connection.socket.on('message', async message => {
      try {
        console.log('Получено сообщение от клиента');
        const { filePath } = JSON.parse(message);

        if (!fs.existsSync(filePath)) {
          connection.socket.send(JSON.stringify({ error: 'Файл не найден' }));
          return;
        }

        const audioFile = fs.readFileSync(filePath);

        // Динамический импорт audio-decode
        const decodeAudio = (await import('audio-decode')).default;
        const audioBuffer = await decodeAudio(audioFile);
        const channelData = audioBuffer.getChannelData(0);

        // Преобразование в Base64
        const base64Chunk = base64EncodeAudio(channelData);

        // Отправка результата
        connection.socket.send(
          JSON.stringify({
            type: 'audio_base64',
            data: base64Chunk,
          })
        );
      } catch (error) {
        console.error('Ошибка при обработке аудио:', error);
        connection.socket.send(
          JSON.stringify({ error: 'Ошибка при обработке аудио' })
        );
      }
    });

    connection.socket.on('close', () => {
      console.log('Клиент отключился');
    });
  });
};
