const db = require('../config/db_sequelize');

module.exports = {
    async postReceita(req, res) {
        try {
            const receita = await db.Receita.create(req.body);
            res.status(201).json(receita);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao criar a receita' });
        }
    },
    async getReceitas(req, res) {
        try {
            const receitas = await db.Receita.findAll();
            res.status(200).json(receitas);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao listar receitas' });
        }
    },
    async getReceitasByCategoria(req, res) {
        try {
            const receitas = await db.Receita.findAll({where: {  categoriaId: req.params.id }});
           
            res.status(200).json(receitas);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao listar receitas' });
        }
    },

    async getReceitaById(req, res) {
        try {
            const receita = await db.Receita.findByPk(req.params.id);
            if (usuario) {
                res.status(200).json(receita);
            } else {
                res.status(404).json({ error: 'Receita não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao obter receita' });
        }
    },
    async putReceita(req, res) {
        try {
            const [updated] = await db.Receita.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedReceita = await db.Receita.findByPk(req.params.id);
                res.status(200).json(updatedReceita);
            } else {
                res.status(404).json({ error: 'Receita não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao atualizar receita' });
        }
    },
    async deleteReceita(req, res) {
        try {
            const deleted = await db.Receita.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).json();
            } else {
                res.status(404).json({ error: 'Receita não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao deletar receita' });
        }
    }
}