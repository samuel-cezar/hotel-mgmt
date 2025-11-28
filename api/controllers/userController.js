const bcrypt = require('bcryptjs');
const db = require('../config/db_sequelize');

module.exports = {
    async postUser(req, res) {
        try {
            const { login, senha, tipo } = req.body;

            if (!login || !senha || tipo === undefined) {
                return res.status(400).json({ error: 'Login, senha e tipo são obrigatórios' });
            }

            const hashedPassword = await bcrypt.hash(senha, 10);

            const usuario = await db.Usuario.create({
                login,
                senha: hashedPassword,
                tipo
            });

            res.status(201).json(usuario);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao criar usuário' });
        }
    },
    
    async getUsers(req, res) {
        try {
            const usuarios = await db.Usuario.findAll();
            res.status(200).json(usuarios);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao listar usuários' });
        }
    },
    
    async getUsersById(req, res) {
        try {
            const usuario = await db.Usuario.findByPk(req.params.id);
            if (usuario) {
                res.status(200).json(usuario);
            } else {
                res.status(404).json({ error: 'Usuário não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao obter usuário' });
        }
    },
    
    async putUser(req, res) {
        try {
            const updateData = { ...req.body };

            // Hash password if it's being updated
            if (updateData.senha) {
                updateData.senha = await bcrypt.hash(updateData.senha, 10);
            }

            const [updated] = await db.Usuario.update(updateData, {
                where: { id: req.params.id }
            });

            if (updated) {
                const updatedUsuario = await db.Usuario.findByPk(req.params.id);
                res.status(200).json(updatedUsuario);
            } else {
                res.status(404).json({ error: 'Usuário não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao atualizar usuário' });
        }
    },
    
    async deleteUser(req, res) {
        try {
            const deleted = await db.Usuario.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Usuário não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao deletar usuário' });
        }
    }
}