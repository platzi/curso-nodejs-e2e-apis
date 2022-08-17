const bcrypt = require('bcrypt');

const sequelize = require('./../../src/db/sequelize');
const { models } = sequelize;

const upSeed = async () => {
  try {
    await sequelize.sync({ force: true }); // create tables
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    await models.User.create({
      email: 'admin@mail.com',
      password: hash,
      role: 'admin'
    });
    await models.Category.bulkCreate([
      {
        name: 'Category 1',
        image: 'https://api.lorem.space/image/game?w=150&h=220'
      },
      {
        name: 'Category 2',
        image: 'https://api.lorem.space/image/game?w=150&h=220'
      }
    ])
  } catch (error) {
    console.error(error);
  }
}

const downSeed = async () => {
  await sequelize.drop();
}

module.exports = {upSeed , downSeed}
