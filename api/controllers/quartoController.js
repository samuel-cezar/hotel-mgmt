const db = require('../config/db_sequelize');

module.exports = {
    async postQuarto(req, res) {
        try {
            const { numero, tipo, preco, disponivel } = req.body;
            
            if (!numero || !tipo || preco === undefined) {
                return res.status(400).json({ error: 'Campos obrigatórios: numero, tipo, preco' });
            }

            if (['Simples', 'Duplo', 'Suíte'].indexOf(tipo) === -1) {
                return res.status(400).json({ error: 'Tipo deve ser: Simples, Duplo ou Suíte' });
            }

            if (preco <= 0) {
                return res.status(400).json({ error: 'Preço deve ser maior que zero' });
            }

            const quarto = await db.Quarto.create({
                numero,
                tipo,
                preco,
                disponivel: disponivel !== undefined ? disponivel : true
            });
            res.status(201).json(quarto);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao criar quarto' });
        }
    },

    async getQuartos(req, res) {
        try {
            const quartos = await db.Quarto.findAll();
            res.status(200).json(quartos);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao listar quartos' });
        }
    },

    async getQuartoById(req, res) {
        try {
            const quarto = await db.Quarto.findByPk(req.params.id);
            if (quarto) {
                res.status(200).json(quarto);
            } else {
                res.status(404).json({ error: 'Quarto não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao obter quarto' });
        }
    },

    async putQuarto(req, res) {
        try {
            const { numero, tipo, preco, disponivel } = req.body;

            if (tipo && ['Simples', 'Duplo', 'Suíte'].indexOf(tipo) === -1) {
                return res.status(400).json({ error: 'Tipo deve ser: Simples, Duplo ou Suíte' });
            }

            if (preco !== undefined && preco <= 0) {
                return res.status(400).json({ error: 'Preço deve ser maior que zero' });
            }

            const [updated] = await db.Quarto.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const quarto = await db.Quarto.findByPk(req.params.id);
                res.status(200).json(quarto);
            } else {
                res.status(404).json({ error: 'Quarto não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao atualizar quarto' });
        }
    },

    async deleteQuarto(req, res) {
        try {
            const deleted = await db.Quarto.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Quarto não encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao deletar quarto' });
        }
    }
};
