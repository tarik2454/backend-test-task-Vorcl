const fastify = require('fastify')({ logger: true });
const axios = require('axios'); // Ensure axios is imported here
const websocketPlugin = require('./plugins/websocket');
const userRoutes = require('./routes/userRoutes');
const cors = require('@fastify/cors');

fastify.register(cors, {
  origin: ['http://localhost:3000'], // Allow only localhost:3000
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
});

// Register plugins
fastify.register(websocketPlugin);
fastify.register(require('@fastify/mongodb'), {
  forceClose: true,
  url: 'mongodb+srv://tarik2454:7L1CXhUWy9EM1t2u@cluster0.f0ezl.mongodb.net/',
});
fastify.register(userRoutes);

// Proxy route for stock data
fastify.get('/api/stock', async (request, reply) => {
  const { symbol, country } = request.query; // Get stock symbol from query

  if (!symbol) {
    return reply.status(400).send({ error: 'Stock symbol is required' });
  }

  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=5m&country={${country}}`
    );
    return reply.send(response.data);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: 'Error fetching data' });
  }
});

// Start the server
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
