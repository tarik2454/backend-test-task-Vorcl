const userService = require('../services/userService');

const getUserById = async (req, reply) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(id);
    if (!user) {
      reply.code(404).send({ message: 'Пользователь не найден' });
    } else {
      reply.send(user);
    }
  } catch (err) {
    reply.code(500).send({ message: 'Ошибка при получении пользователя' });
  }
};

module.exports = { getUserById };
