const db = require('../config/db_sequelize');

module.exports = {
    async postUser(req, res) {
        try {
            const usuario = await db.Usuario.create(req.body);
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
            const [updated] = await db.Usuario.update(req.body, {
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
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'Usuário não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao deletar usuário' });
        }
    }
}