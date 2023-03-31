const bcrypt = require('bcrypt');

const sequelize = require('../../src/db/sequelize');
const { models } = sequelize;

const upSeed = async () => {
  await sequelize.sync({ force: true });
  const password = await bcrypt.hash('admin123', 10);
  await models.User.create({
    email: 'admin@mail.com',
    password,
  });
  await models.Category.bulkCreate([
    {
      name: 'CategoryI',
      image: 'https://api.lorem.space/image/game?w=150&h=220',
    },
    {
      name: 'CategoryII',
      image: 'https://api.lorem.space/image/game?w=150&h=220',
    },
  ]);
};

const downSeed = async () => {
  await sequelize.drop();
};

module.exports = { upSeed, downSeed };
