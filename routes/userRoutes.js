const userController = require('../controllers/userController');
const userSchema = require('../schemas/userSchema');

module.exports = async fastify => {
  fastify.post('/register', {
    schema: userSchema,
    handler: userController.registerUser,
  });
};
