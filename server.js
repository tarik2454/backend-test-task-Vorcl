const fastify = require('fastify')({ logger: true });
const fastifyWebsocket = require('@fastify/websocket');

// Подключаем плагин WebSocket
fastify.register(fastifyWebsocket);

// Маршрут для WebSocket
fastify.get('/ws', { websocket: true }, (connection, req) => {
  console.log('Клиент подключился');

  // Слушаем сообщения от клиента
  connection.socket.on('message', message => {
    console.log('Получено сообщение от клиента:', message);

    // Отправляем ответ клиенту
    connection.socket.send(`Эхо: ${message}`);
  });

  // Закрытие соединения
  connection.socket.on('close', () => {
    console.log('Клиент отключился');
  });
});

// Запуск сервера
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Сервер запущен на http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
