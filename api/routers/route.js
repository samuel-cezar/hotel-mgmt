const express = require('express');
const clienteController = require('../controllers/clienteController');
const quartoController = require('../controllers/quartoController');
const reservaController = require('../controllers/reservaController');
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

const db = require('../config/db_sequelize');

// Sincronizar banco com force: true apenas uma vez
db.sequelize.sync({force: true}).then(() => {
    console.log('✅ Banco sincronizado com sucesso!');
    // Criar usuário admin após sincronizar
    db.Usuario.create({login:'admin', senha:'1234', tipo:2})
        .then(() => console.log('✅ Usuário admin criado!'))
        .catch(err => console.log('ℹ️ Usuário admin já existe ou erro:', err.message));
}).catch(err => {
    console.error('❌ Erro ao sincronizar banco:', err.message);
});

router.post('/login', authController.login);

// Rotas de Cliente
router.get('/clientes', authenticateToken, clienteController.getClientes);
router.post('/clientes', authenticateToken, clienteController.postCliente);
router.get('/clientes/:id', authenticateToken, clienteController.getClienteById);
router.put('/clientes/:id', authenticateToken, clienteController.putCliente);
router.delete('/clientes/:id', authenticateToken, clienteController.deleteCliente);

// Rotas de Quarto
router.get('/quartos', authenticateToken, quartoController.getQuartos);
router.post('/quartos', authenticateToken, quartoController.postQuarto);
router.get('/quartos/:id', authenticateToken, quartoController.getQuartoById);
router.put('/quartos/:id', authenticateToken, quartoController.putQuarto);
router.delete('/quartos/:id', authenticateToken, quartoController.deleteQuarto);

// Rotas de Reserva
router.get('/reservas', authenticateToken, reservaController.getReservas);
router.post('/reservas', authenticateToken, reservaController.postReserva);
router.get('/reservas/:id', authenticateToken, reservaController.getReservaById);
router.put('/reservas/:id', authenticateToken, reservaController.putReserva);
router.delete('/reservas/:id', authenticateToken, reservaController.deleteReserva);

module.exports = router;
