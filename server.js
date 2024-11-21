const fastify = require('fastify')({ logger: true });
const { MongoClient } = require('mongodb');
const websocketPlugin = require('./plugins/websocket');
const userRoutes = require('./routes/userRoutes');
const userSchema = require('./schemas/userSchema');
const userService = require('./services/userService');

// Регистрируем плагины
fastify.register(websocketPlugin);
fastify.register(require('@fastify/mongodb'), {
  forceClose: true,
  url: 'mongodb+srv://tarik2454:7L1CXhUWy9EM1t2u@cluster0.f0ezl.mongodb.net/',
});

// Регистрируем маршруты
fastify.register(userRoutes);

// Новый маршрут для регистрации пользователя
fastify.post('/register', {
  schema: {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
      },
      required: ['email'],
    },
  },
  handler: async (req, reply) => {
    const { email } = req.body;

    // Логика для добавления пользователя в базу данных
    try {
      const result = await userService.createUser({ email });
      reply.code(201).send({
        message: 'Пользователь успешно зарегистрирован',
        user: result,
      });
    } catch (err) {
      reply
        .code(500)
        .send({ message: 'Произошла ошибка при регистрации пользователя' });
    }
  },
});

// Стартуем сервер
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

// const fastify = require('fastify')({ logger: true });
// const fastifyWebsocket = require('@fastify/websocket');
// const { ObjectId } = require('mongodb');

// // Подключаем плагин WebSocket
// fastify.register(fastifyWebsocket);

// // Маршрут для WebSocket
// fastify.get('/ws', { websocket: true }, (connection, req) => {
//   console.log('Клиент подключился');

//   // Слушаем сообщения от клиента
//   connection.socket.on('message', message => {
//     console.log('Получено сообщение от клиента:', message);

//     // Отправляем ответ клиенту
//     connection.socket.send(`Эхо: ${message}`);
//   });

//   // Закрытие соединения
//   connection.socket.on('close', () => {
//     console.log('Клиент отключился');
//   });
// });

// // Подключение MongoDB
// fastify.register(require('@fastify/mongodb'), {
//   forceClose: true,
//   url: 'mongodb+srv://tarik2454:7L1CXhUWy9EM1t2u@cluster0.f0ezl.mongodb.net/',
// });

// fastify.get('/', async (request, reply) => {
//   return { message: 'Сервер работает!' };
// });

// // Получение пользователя по ID
// fastify.get('/user/:id', async function (req, reply) {
//   const users = this.mongo.db.collection('users');

//   const id = this.mongo.ObjectId(req.params.id);
//   try {
//     const user = await users.findOne({ id });
//     return user;
//   } catch (err) {
//     return err;
//   }
// });

// // Запуск сервера
// const start = async () => {
//   try {
//     await fastify.listen({ port: 3001, host: '0.0.0.0' });
//     console.log('Сервер запущен на http://localhost:3001');
//   } catch (err) {
//     fastify.log.error(err);
//     process.exit(1);
//   }
// };

// start();
