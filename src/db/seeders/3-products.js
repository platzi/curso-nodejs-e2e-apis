const { PRODUCT_TABLE } = require('../models/product.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }

    return queryInterface.bulkInsert(PRODUCT_TABLE, [
      {
        name: 'ProductI',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
        description: 'bla bla bla bla',
        price: 10000,
        category_id: 1,
        created_at: new Date(),
      },
      {
        name: 'ProductII',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
        description: 'bla bla bla bla',
        price: 20000,
        category_id: 1,
        created_at: new Date(),
      },
      {
        name: 'ProductIII',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
        description: 'bla bla bla bla',
        price: 12000,
        category_id: 2,
        created_at: new Date(),
      },
      {
        name: 'ProductIV',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
        description: 'bla bla bla bla',
        price: 15000,
        category_id: 2,
        created_at: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }

    return queryInterface.bulkDelete(PRODUCT_TABLE, null, {});
  },
};
