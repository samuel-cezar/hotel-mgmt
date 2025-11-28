const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME || 'web2_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '1234',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'postgres'
  }
);

var db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Usuario = require('../models/usuario.js')(sequelize, Sequelize);
db.Cliente = require('../models/cliente.js')(sequelize, Sequelize);
db.Quarto = require('../models/quarto.js')(sequelize, Sequelize);
db.Reserva = require('../models/reserva.js')(sequelize, Sequelize);

// Relacionamentos
db.Cliente.hasMany(db.Reserva, {foreignKey:'clienteId', onDelete: 'CASCADE'});
db.Reserva.belongsTo(db.Cliente, {foreignKey:'clienteId'});

db.Quarto.hasMany(db.Reserva, {foreignKey:'quartoId', onDelete: 'NO ACTION'});
db.Reserva.belongsTo(db.Quarto, {foreignKey:'quartoId'});

module.exports = db;

