const fastifyWebsocket = require('@fastify/websocket');

module.exports = async fastify => {
  fastify.register(fastifyWebsocket);

  fastify.get('/ws', { websocket: true }, (connection, req) => {
    console.log('Клиент подключился');

    connection.socket.on('message', message => {
      console.log('Получено сообщение от клиента:', message);
      connection.socket.send(`Эхо: ${message}`);
    });

    connection.socket.on('close', () => {
      console.log('Клиент отключился');
    });
  });
};
