const bcrypt = require('bcrypt');
const { USER_TABLE } = require('./../models/user.model');

module.exports = {
  up: async (queryInterface) => {
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    return queryInterface.bulkInsert(USER_TABLE, [{
      email: 'admin@mail.com',
      password: hash,
      role: 'admin',
      created_at: new Date()
    }]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete(USER_TABLE, null, {});
  }
};
