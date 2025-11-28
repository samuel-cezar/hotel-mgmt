const request = require('supertest');
const express = require('express');
const authController = require('../controllers/authController');
const routes = require('../routers/route');
const db = require('../config/db_sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('Authentication Tests', () => {
    
    beforeEach(async () => {
        // Recreate tables before each test
        await db.sequelize.sync({ force: true });
        
        // Create test user with hashed password
        const hashedPassword = await bcrypt.hash('password123', 10);
        await db.Usuario.create({
            login: 'testuser',
            senha: hashedPassword,
            tipo: 1
        });
    });

    describe('POST /api/login', () => {
        test('should login successfully with correct credentials', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({
                    login: 'testuser',
                    senha: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(typeof response.body.token).toBe('string');
        });

        test('should return 404 for non-existent user', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({
                    login: 'nonexistent',
                    senha: 'password123'
                });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Usuário não encontrado');
        });

        test('should return 401 for incorrect password', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({
                    login: 'testuser',
                    senha: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Senha incorreta');
        });

        test('should return 400 for missing login', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({
                    senha: 'password123'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        test('should return 400 for missing password', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({
                    login: 'testuser'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        test('should generate valid JWT token', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({
                    login: 'testuser',
                    senha: 'password123'
                });

            expect(response.status).toBe(200);
            const token = response.body.token;

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
            expect(decoded).toHaveProperty('id');
            expect(decoded).toHaveProperty('login');
            expect(decoded.login).toBe('testuser');
        });
    });

    describe('Protected Routes', () => {
        test('should return 401 for missing token on protected route', async () => {
            const response = await request(app)
                .get('/api/quartos');

            expect(response.status).toBe(401);
        });

        test('should return 403 for invalid token on protected route', async () => {
            const response = await request(app)
                .get('/api/quartos')
                .set('Authorization', 'Bearer invalid_token');

            expect(response.status).toBe(403);
        });

        test('should access protected route with valid token', async () => {
            // Login first to get token
            const loginResponse = await request(app)
                .post('/api/login')
                .send({
                    login: 'testuser',
                    senha: 'password123'
                });

            const token = loginResponse.body.token;

            // Access protected route
            const response = await request(app)
                .get('/api/quartos')
                .set('Authorization', `Bearer ${token}`);

            // Should not return 401 or 403
            expect([401, 403]).not.toContain(response.status);
        });

        test('should return 401 or 403 for malformed authorization header', async () => {
            const response = await request(app)
                .get('/api/quartos')
                .set('Authorization', 'InvalidFormat token');

            // Malformed header with invalid token should return 403
            expect([401, 403]).toContain(response.status);
        });
    });
});
