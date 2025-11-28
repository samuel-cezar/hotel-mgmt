const db = require('../config/db_sequelize');
const bcrypt = require('bcryptjs');

describe('Database Setup Tests', () => {
    test('database connection should be successful', async () => {
        try {
            await db.sequelize.authenticate();
            expect(true).toBe(true);
        } catch (err) {
            fail('Database connection failed: ' + err.message);
        }
    });

    test('database should synchronize successfully', async () => {
        try {
            await db.sequelize.sync({ force: true });
            expect(true).toBe(true);
        } catch (err) {
            fail('Database sync failed: ' + err.message);
        }
    });

    test('should create usuario model', async () => {
        await db.sequelize.sync({ force: true });
        const hashedPassword = await bcrypt.hash('test123', 10);
        const usuario = await db.Usuario.create({
            login: 'testuser',
            senha: hashedPassword,
            tipo: 1
        });
        
        expect(usuario).toBeDefined();
        expect(usuario.id).toBeDefined();
        expect(usuario.login).toBe('testuser');
    });

    test('should create cliente model', async () => {
        await db.sequelize.sync({ force: true });
        const cliente = await db.Cliente.create({
            nome: 'Test Client',
            cpf: '123.456.789-00',
            email: 'test@example.com',
            telefone: '123456789'
        });
        
        expect(cliente).toBeDefined();
        expect(cliente.id).toBeDefined();
        expect(cliente.nome).toBe('Test Client');
    });

    test('should create quarto model', async () => {
        await db.sequelize.sync({ force: true });
        const quarto = await db.Quarto.create({
            numero: '101',
            tipo: 'Duplo',
            preco: 100.00,
            disponivel: true
        });
        
        expect(quarto).toBeDefined();
        expect(quarto.id).toBeDefined();
        expect(quarto.numero).toBe('101');
    });

    test('should create reserva model with relationships', async () => {
        await db.sequelize.sync({ force: true });
        
        const cliente = await db.Cliente.create({
            nome: 'Test Client',
            cpf: '123.456.789-00',
            email: 'test@example.com',
            telefone: '123456789'
        });

        const quarto = await db.Quarto.create({
            numero: '101',
            tipo: 'Duplo',
            preco: 100.00,
            disponivel: true
        });

        const reserva = await db.Reserva.create({
            clienteId: cliente.id,
            quartoId: quarto.id,
            data_entrada: new Date('2024-12-20'),
            data_saida: new Date('2024-12-25'),
            valor_total: 500.00
        });
        
        expect(reserva).toBeDefined();
        expect(reserva.id).toBeDefined();
        expect(reserva.clienteId).toBe(cliente.id);
        expect(reserva.quartoId).toBe(quarto.id);
    });
});

// Global setup before any tests
beforeAll(async () => {
    try {
        // Connect to test database
        await db.sequelize.authenticate();
        console.log('✅ Connected to test database');
    } catch (err) {
        console.error('❌ Database setup failed:', err);
        throw err;
    }
});

// Global cleanup after all tests
afterAll(async () => {
    try {
        await db.sequelize.close();
        console.log('✅ Test database connection closed');
    } catch (err) {
        console.error('❌ Error closing database:', err);
    }
});
