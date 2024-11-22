// routes/userRoutes.js
const userController = require('../controllers/userController');
const userSchema = require('../schemas/userSchema');

module.exports = async fastify => {
  // Регистрация пользователя
  fastify.post('/register', {
    schema: userSchema, // Применение схемы для валидации
    handler: userController.registerUser, // Использование обработчика
  });

  fastify.get('/', async (request, reply) => {
    return { message: 'Сервер работает!!!!!' };
  });
};
