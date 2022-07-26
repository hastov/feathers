const Sequelize = require('sequelize');

const attributes = {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  completed: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  due: {
    type: Sequelize.DATE,
    allowNull: false,
  }
};

module.exports = attributes;