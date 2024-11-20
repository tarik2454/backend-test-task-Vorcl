const userController = require('../controllers/userController');
const userSchema = require('../schemas/userSchema');

module.exports = async fastify => {
  fastify.get('/', async (request, reply) => {
    return { message: 'Сервер работает!' };
  });

  fastify.get('/user/:id', {
    schema: {
      params: { type: 'object', properties: { id: { type: 'string' } } },
    },
    handler: userController.getUserById,
  });

  fastify.post('/user', {
    schema: {
      body: userSchema,
    },
    handler: async (req, reply) => {
      const newUser = req.body;
      // Логика для создания пользователя
      reply.send(newUser);
    },
  });
};
