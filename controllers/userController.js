const userService = require('../services/userService');

const registerUser = async (req, reply) => {
  const { email } = req.body;

  if (!email) {
    reply.code(400).send({ message: 'Email не предоставлен' });
    return;
  }

  try {
    const newUser = await userService.registerUser(email);
    reply.send({
      message: 'User successfully registered',
      user: newUser,
    });
  } catch (error) {
    reply.code(500).send({
      message: 'User registration error',
      error: error.message,
    });
  }
};

module.exports = { registerUser };
