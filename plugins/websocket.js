const fs = require('fs');
const fastifyWebsocket = require('@fastify/websocket');
const path = require('path');

function floatTo16BitPCM(float32Array) {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32Array.length; i++) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

function base64EncodeAudio(float32Array) {
  const arrayBuffer = floatTo16BitPCM(float32Array);
  return Buffer.from(new Uint8Array(arrayBuffer)).toString('base64');
}

module.exports = async fastify => {
  fastify.register(fastifyWebsocket);

  fastify.get('/ws', { websocket: true }, (connection, req) => {
    console.log('Client connected');

    connection.socket.on('message', async message => {
      try {
        const parsedMessage = JSON.parse(message);
        const { filePath } = parsedMessage;

        // Проверка пути к файлу
        if (!filePath || typeof filePath !== 'string') {
          throw new Error('Invalid file path');
        }

        const resolvedPath = path.resolve(filePath);
        if (!fs.existsSync(resolvedPath)) {
          console.error('File not found:', resolvedPath);
          connection.socket.send(JSON.stringify({ error: 'File not found' }));
          return;
        }

        const audioFile = fs.readFileSync(resolvedPath);

        const decodeAudio = (await import('audio-decode')).default;
        let audioBuffer;
        try {
          audioBuffer = await decodeAudio(audioFile);
        } catch (err) {
          console.error('Error decoding audio:', err);
          connection.socket.send(
            JSON.stringify({ error: 'Error decoding audio file' })
          );
          return;
        }

        const channelData = audioBuffer.getChannelData(0);
        const base64Chunk = base64EncodeAudio(channelData);

        connection.socket.send(
          JSON.stringify({
            type: 'audio_base64',
            data: base64Chunk,
          })
        );
      } catch (error) {
        console.error('Error processing message:', error);
        connection.socket.send(
          JSON.stringify({ error: 'Error processing audio' })
        );
      }
    });

    connection.socket.on('close', () => {
      console.log('Client disconnected');
    });
  });
};
