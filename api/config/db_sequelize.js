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
db.Receita = require('../models/receita.js')(sequelize, Sequelize);
db.Categoria = require('../models/categoria.js')(sequelize, Sequelize);
db.Categoria.hasMany(db.Receita, {foreignKey:'categoriaId', onDelete: 'NO ACTION'});
module.exports = db;

