// userController.js
const userService = require('../services/userService');

const registerUser = async (req, reply) => {
  console.log('Получен запрос на регистрацию:', req.body);

  const { email } = req.body;

  if (!email) {
    reply.code(400).send({ message: 'Email не предоставлен' });
    return;
  }

  try {
    const newUser = await userService.registerUser(email);
    console.log('Пользователь зарегистрирован:', newUser);
    reply.send({
      message: 'Пользователь успешно зарегистрирован',
      user: newUser,
    });
  } catch (err) {
    console.error('Ошибка регистрации пользователя:', err);
    reply
      .code(500)
      .send({ message: 'Ошибка регистрации пользователя', error: err.message });
  }
};

module.exports = { registerUser };
