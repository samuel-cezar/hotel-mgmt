const db = require('../config/db_sequelize');

module.exports = {
    async postCategoria(req, res) {
        try {
            const categoria = await db.Categoria.create(req.body);
            res.status(201).json(categoria);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao criar a categoria' });
        }
    },
    async getCategorias(req, res) {
        try {
            const categorias = await db.Categoria.findAll();
            res.status(200).json(categorias);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao listar categorias' });
        }
    },
    async getCategoriaById(req, res) {
        try {
            const categoria = await db.Categoria.findByPk(req.params.id);
            if (usuario) {
                res.status(200).json(categoria);
            } else {
                res.status(404).json({ error: 'Categoria não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao obter categoria' });
        }
    },
    async putCategoria(req, res) {
        try {
            const [updated] = await db.Categoria.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedCategoria = await db.Categoria.findByPk(req.params.id);
                res.status(200).json(updatedCategoria);
            } else {
                res.status(404).json({ error: 'Categoria não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao atualizar categoria' });
        }
    },
    async deleteCategoria(req, res) {
        try {
            const deleted = await db.Categoria.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'Categoria não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao deletar categoria' });
        }
    }
}