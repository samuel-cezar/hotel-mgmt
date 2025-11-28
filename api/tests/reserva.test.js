const request = require('supertest');
const express = require('express');
const routes = require('../routers/route');
const db = require('../config/db_sequelize');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use('/api', routes);

let authToken;
let testCliente;
let testQuarto;

describe('Reserva Tests', () => {
    
    beforeEach(async () => {
        // Recreate tables
        await db.sequelize.sync({ force: true });

        // Create test user
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = await db.Usuario.create({
            login: 'testuser',
            senha: hashedPassword,
            tipo: 1
        });

        // Login to get token
        const loginResponse = await request(app)
            .post('/api/login')
            .send({
                login: 'testuser',
                senha: 'password123'
            });

        authToken = loginResponse.body.token;

        // Create test cliente
        testCliente = await db.Cliente.create({
            nome: 'Test Cliente',
            cpf: '123.456.789-00',
            email: 'cliente@test.com',
            telefone: '1234567890'
        });

        // Create test quarto
        testQuarto = await db.Quarto.create({
            numero: '101',
            tipo: 'Duplo',
            preco: 100.00,
            disponivel: true
        });
    });

    describe('POST /api/reservas', () => {
        test('should create reservation successfully', async () => {
            const entrada = new Date('2024-12-20');
            const saida = new Date('2024-12-25');

            const response = await request(app)
                .post('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    clienteId: testCliente.id,
                    quartoId: testQuarto.id,
                    data_entrada: entrada.toISOString(),
                    data_saida: saida.toISOString()
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('valor_total');
            expect(parseFloat(response.body.valor_total)).toBe(500.00); // 5 days * 100
        });

        test('should return 400 for missing required fields', async () => {
            const response = await request(app)
                .post('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    clienteId: testCliente.id,
                    // missing quartoId, data_entrada, data_saida
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        test('should return 400 when saida date is before entrada date', async () => {
            const entrada = new Date('2024-12-25');
            const saida = new Date('2024-12-20');

            const response = await request(app)
                .post('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    clienteId: testCliente.id,
                    quartoId: testQuarto.id,
                    data_entrada: entrada.toISOString(),
                    data_saida: saida.toISOString()
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('saída deve ser maior');
        });

        test('should return 400 when saida equals entrada', async () => {
            const date = new Date('2024-12-25');

            const response = await request(app)
                .post('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    clienteId: testCliente.id,
                    quartoId: testQuarto.id,
                    data_entrada: date.toISOString(),
                    data_saida: date.toISOString()
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('saída deve ser maior');
        });

        test('should return 404 for non-existent cliente', async () => {
            const entrada = new Date('2024-12-20');
            const saida = new Date('2024-12-25');

            const response = await request(app)
                .post('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    clienteId: 9999,
                    quartoId: testQuarto.id,
                    data_entrada: entrada.toISOString(),
                    data_saida: saida.toISOString()
                });

            expect(response.status).toBe(404);
            expect(response.body.error).toContain('Cliente');
        });

        test('should return 404 for non-existent quarto', async () => {
            const entrada = new Date('2024-12-20');
            const saida = new Date('2024-12-25');

            const response = await request(app)
                .post('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    clienteId: testCliente.id,
                    quartoId: 9999,
                    data_entrada: entrada.toISOString(),
                    data_saida: saida.toISOString()
                });

            expect(response.status).toBe(404);
            expect(response.body.error).toContain('Quarto');
        });

        test('should return 400 for overlapping reservations', async () => {
            const entrada1 = new Date('2024-12-20');
            const saida1 = new Date('2024-12-25');

            // Create first reservation
            await request(app)
                .post('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    clienteId: testCliente.id,
                    quartoId: testQuarto.id,
                    data_entrada: entrada1.toISOString(),
                    data_saida: saida1.toISOString()
                });

            // Try to create overlapping reservation (same period)
            const response = await request(app)
                .post('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    clienteId: testCliente.id,
                    quartoId: testQuarto.id,
                    data_entrada: entrada1.toISOString(),
                    data_saida: saida1.toISOString()
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('não disponível');
        });

        test('should return 400 for partial overlapping reservations', async () => {
            const entrada1 = new Date('2024-12-20');
            const saida1 = new Date('2024-12-25');

            // Create first reservation
            await request(app)
                .post('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    clienteId: testCliente.id,
                    quartoId: testQuarto.id,
                    data_entrada: entrada1.toISOString(),
                    data_saida: saida1.toISOString()
                });

            // Try to create overlapping reservation (partial overlap)
            const entrada2 = new Date('2024-12-23');
            const saida2 = new Date('2024-12-28');

            const response = await request(app)
                .post('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    clienteId: testCliente.id,
                    quartoId: testQuarto.id,
                    data_entrada: entrada2.toISOString(),
                    data_saida: saida2.toISOString()
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('não disponível');
        });

        test('should allow non-overlapping reservations', async () => {
            const entrada1 = new Date('2024-12-20');
            const saida1 = new Date('2024-12-25');

            // Create first reservation
            await request(app)
                .post('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    clienteId: testCliente.id,
                    quartoId: testQuarto.id,
                    data_entrada: entrada1.toISOString(),
                    data_saida: saida1.toISOString()
                });

            // Create non-overlapping reservation (after first one)
            const entrada2 = new Date('2024-12-25');
            const saida2 = new Date('2024-12-30');

            const response = await request(app)
                .post('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    clienteId: testCliente.id,
                    quartoId: testQuarto.id,
                    data_entrada: entrada2.toISOString(),
                    data_saida: saida2.toISOString()
                });

            expect(response.status).toBe(201);
        });

        test('should calculate valor_total correctly for different day counts', async () => {
            // Test with 3 days
            const entrada = new Date('2024-12-20');
            const saida = new Date('2024-12-23');

            const response = await request(app)
                .post('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    clienteId: testCliente.id,
                    quartoId: testQuarto.id,
                    data_entrada: entrada.toISOString(),
                    data_saida: saida.toISOString()
                });

            expect(response.status).toBe(201);
            expect(parseFloat(response.body.valor_total)).toBe(300.00); // 3 days * 100
        });
    });

    describe('GET /api/reservas', () => {
        test('should list all reservations', async () => {
            // Create a reservation
            const entrada = new Date('2024-12-20');
            const saida = new Date('2024-12-25');

            await request(app)
                .post('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    clienteId: testCliente.id,
                    quartoId: testQuarto.id,
                    data_entrada: entrada.toISOString(),
                    data_saida: saida.toISOString()
                });

            const response = await request(app)
                .get('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
        });

        test('should include Cliente and Quarto in reservations list', async () => {
            const entrada = new Date('2024-12-20');
            const saida = new Date('2024-12-25');

            await request(app)
                .post('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    clienteId: testCliente.id,
                    quartoId: testQuarto.id,
                    data_entrada: entrada.toISOString(),
                    data_saida: saida.toISOString()
                });

            const response = await request(app)
                .get('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body[0]).toHaveProperty('cliente');
            expect(response.body[0]).toHaveProperty('quarto');
            expect(response.body[0].cliente.nome).toBe('Test Cliente');
            expect(response.body[0].quarto.numero).toBe('101');
        });
    });

    describe('GET /api/reservas/:id', () => {
        test('should get reservation by id', async () => {
            const entrada = new Date('2024-12-20');
            const saida = new Date('2024-12-25');

            const createResponse = await request(app)
                .post('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    clienteId: testCliente.id,
                    quartoId: testQuarto.id,
                    data_entrada: entrada.toISOString(),
                    data_saida: saida.toISOString()
                });

            const reservaId = createResponse.body.id;

            const response = await request(app)
                .get(`/api/reservas/${reservaId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(reservaId);
            expect(response.body).toHaveProperty('cliente');
            expect(response.body).toHaveProperty('quarto');
        });

        test('should return 404 for non-existent reservation', async () => {
            const response = await request(app)
                .get('/api/reservas/9999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('PUT /api/reservas/:id', () => {
        test('should update reservation dates', async () => {
            const entrada1 = new Date('2024-12-20');
            const saida1 = new Date('2024-12-25');

            const createResponse = await request(app)
                .post('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    clienteId: testCliente.id,
                    quartoId: testQuarto.id,
                    data_entrada: entrada1.toISOString(),
                    data_saida: saida1.toISOString()
                });

            const reservaId = createResponse.body.id;

            // Update dates
            const entrada2 = new Date('2024-12-26');
            const saida2 = new Date('2024-12-30');

            const response = await request(app)
                .put(`/api/reservas/${reservaId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    data_entrada: entrada2.toISOString(),
                    data_saida: saida2.toISOString()
                });

            expect(response.status).toBe(200);
            expect(parseFloat(response.body.valor_total)).toBe(400.00); // 4 days * 100
        });

        test('should recalculate valor_total on quarto change', async () => {
            // Create a more expensive quarto
            const expensiveQuarto = await db.Quarto.create({
                numero: '202',
                tipo: 'Suíte',
                preco: 250.00,
                disponivel: true
            });

            const entrada1 = new Date('2024-12-20');
            const saida1 = new Date('2024-12-25');

            const createResponse = await request(app)
                .post('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    clienteId: testCliente.id,
                    quartoId: testQuarto.id,
                    data_entrada: entrada1.toISOString(),
                    data_saida: saida1.toISOString()
                });

            const reservaId = createResponse.body.id;

            // Change quarto
            const response = await request(app)
                .put(`/api/reservas/${reservaId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    quartoId: expensiveQuarto.id
                });

            expect(response.status).toBe(200);
            expect(parseFloat(response.body.valor_total)).toBe(1250.00); // 5 days * 250
        });

        test('should return 404 for non-existent reservation', async () => {
            const response = await request(app)
                .put('/api/reservas/9999')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    data_entrada: new Date().toISOString(),
                    data_saida: new Date().toISOString()
                });

            expect(response.status).toBe(404);
        });

        test('should return 400 when updating to invalid date range', async () => {
            const entrada1 = new Date('2024-12-20');
            const saida1 = new Date('2024-12-25');

            const createResponse = await request(app)
                .post('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    clienteId: testCliente.id,
                    quartoId: testQuarto.id,
                    data_entrada: entrada1.toISOString(),
                    data_saida: saida1.toISOString()
                });

            const reservaId = createResponse.body.id;

            const response = await request(app)
                .put(`/api/reservas/${reservaId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    data_entrada: new Date('2024-12-25').toISOString(),
                    data_saida: new Date('2024-12-20').toISOString()
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('saída deve ser maior');
        });
    });

    describe('DELETE /api/reservas/:id', () => {
        test('should delete reservation successfully', async () => {
            const entrada = new Date('2024-12-20');
            const saida = new Date('2024-12-25');

            const createResponse = await request(app)
                .post('/api/reservas')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    clienteId: testCliente.id,
                    quartoId: testQuarto.id,
                    data_entrada: entrada.toISOString(),
                    data_saida: saida.toISOString()
                });

            const reservaId = createResponse.body.id;

            const response = await request(app)
                .delete(`/api/reservas/${reservaId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(204);

            // Verify deleted
            const getResponse = await request(app)
                .get(`/api/reservas/${reservaId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(getResponse.status).toBe(404);
        });

        test('should return 404 when deleting non-existent reservation', async () => {
            const response = await request(app)
                .delete('/api/reservas/9999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
        });
    });
});
