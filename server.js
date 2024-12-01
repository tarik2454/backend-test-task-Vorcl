const fastify = require('fastify')({ logger: true });
const websocketPlugin = require('./plugins/websocket');
const userRoutes = require('./routes/userRoutes');
const cors = require('@fastify/cors');
const stockRoutes = require('./routes/stockRoutes'); // Добавьте правильный путь

// Регистрация необходимых плагинов
fastify.register(cors, {
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

fastify.register(require('@fastify/mongodb'), {
  forceClose: true,
  url: 'mongodb+srv://tarik2454:7L1CXhUWy9EM1t2u@cluster0.f0ezl.mongodb.net/backend-test-task-Vorcl?retryWrites=true&w=majority&appName=Cluster0',
});

fastify.register(websocketPlugin);
fastify.register(userRoutes);
fastify.register(stockRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server is running at http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
