const db = require('../config/db_sequelize');
const { Op } = require('sequelize');

module.exports = {
    async postReserva(req, res) {
        try {
            const { clienteId, quartoId, data_entrada, data_saida } = req.body;

            if (!clienteId || !quartoId || !data_entrada || !data_saida) {
                return res.status(400).json({ error: 'Campos obrigatórios: clienteId, quartoId, data_entrada, data_saida' });
            }

            const entrada = new Date(data_entrada);
            const saida = new Date(data_saida);

            if (saida <= entrada) {
                return res.status(400).json({ error: 'Data de saída deve ser maior que data de entrada' });
            }

            // Verifica se o cliente existe
            const cliente = await db.Cliente.findByPk(clienteId);
            if (!cliente) {
                return res.status(404).json({ error: 'Cliente não encontrado' });
            }

            // Verifica se o quarto existe
            const quarto = await db.Quarto.findByPk(quartoId);
            if (!quarto) {
                return res.status(404).json({ error: 'Quarto não encontrado' });
            }

            // Verifica disponibilidade (sem reservas sobrepostas)
            const reservasConflito = await db.Reserva.findAll({
                where: {
                    quartoId: quartoId,
                    [Op.or]: [
                        {
                            data_entrada: { [Op.lt]: saida },
                            data_saida: { [Op.gt]: entrada }
                        }
                    ]
                }
            });

            if (reservasConflito.length > 0) {
                return res.status(400).json({ error: 'Quarto não disponível para este período' });
            }

            // Calcula valor total (dias × preço)
            const dias = Math.ceil((saida - entrada) / (1000 * 60 * 60 * 24));
            const valor_total = dias * parseFloat(quarto.preco);

            const reserva = await db.Reserva.create({
                clienteId,
                quartoId,
                data_entrada,
                data_saida,
                valor_total
            });

            // Busca a reserva criada com dados associados
            const reservaCompleta = await db.Reserva.findByPk(reserva.id, {
                include: [
                    { model: db.Cliente, as: 'cliente' },
                    { model: db.Quarto, as: 'quarto' }
                ]
            });

            res.status(201).json(reservaCompleta);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao criar reserva' });
        }
    },

    async getReservas(req, res) {
        try {
            const reservas = await db.Reserva.findAll({
                include: [
                    { model: db.Cliente, as: 'cliente' },
                    { model: db.Quarto, as: 'quarto' }
                ]
            });
            res.status(200).json(reservas);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao listar reservas' });
        }
    },

    async getReservaById(req, res) {
        try {
            const reserva = await db.Reserva.findByPk(req.params.id, {
                include: [
                    { model: db.Cliente, as: 'cliente' },
                    { model: db.Quarto, as: 'quarto' }
                ]
            });
            if (reserva) {
                res.status(200).json(reserva);
            } else {
                res.status(404).json({ error: 'Reserva não encontrada' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao obter reserva' });
        }
    },

    async putReserva(req, res) {
        try {
            const { data_entrada, data_saida, quartoId } = req.body;
            const reservaId = req.params.id;

            const reserva = await db.Reserva.findByPk(reservaId);
            if (!reserva) {
                return res.status(404).json({ error: 'Reserva não encontrada' });
            }

            if (data_entrada && data_saida) {
                const entrada = new Date(data_entrada);
                const saida = new Date(data_saida);

                if (saida <= entrada) {
                    return res.status(400).json({ error: 'Data de saída deve ser maior que data de entrada' });
                }

                // Se o quarto foi alterado ou as datas mudaram, verifica disponibilidade
                const quartoParaValidar = quartoId || reserva.quartoId;
                const reservasConflito = await db.Reserva.findAll({
                    where: {
                        quartoId: quartoParaValidar,
                        id: { [Op.ne]: reservaId },
                        [Op.or]: [
                            {
                                data_entrada: { [Op.lt]: saida },
                                data_saida: { [Op.gt]: entrada }
                            }
                        ]
                    }
                });

                if (reservasConflito.length > 0) {
                    return res.status(400).json({ error: 'Quarto não disponível para este período' });
                }

                // Recalcula valor total se as datas mudarem
                if (quartoId && quartoId !== reserva.quartoId) {
                    const quarto = await db.Quarto.findByPk(quartoId);
                    if (!quarto) {
                        return res.status(404).json({ error: 'Quarto não encontrado' });
                    }
                    const dias = Math.ceil((saida - entrada) / (1000 * 60 * 60 * 24));
                    req.body.valor_total = dias * parseFloat(quarto.preco);
                } else {
                    const dias = Math.ceil((saida - entrada) / (1000 * 60 * 60 * 24));
                    const quarto = await db.Quarto.findByPk(reserva.quartoId);
                    req.body.valor_total = dias * parseFloat(quarto.preco);
                }
            } else if (quartoId && quartoId !== reserva.quartoId) {
                // Se apenas o quarto for alterado sem as datas, recalcula com as datas existentes
                const quarto = await db.Quarto.findByPk(quartoId);
                if (!quarto) {
                    return res.status(404).json({ error: 'Quarto não encontrado' });
                }
                const entrada = new Date(reserva.data_entrada);
                const saida = new Date(reserva.data_saida);
                const dias = Math.ceil((saida - entrada) / (1000 * 60 * 60 * 24));
                req.body.valor_total = dias * parseFloat(quarto.preco);
            }

            const [updated] = await db.Reserva.update(req.body, {
                where: { id: reservaId }
            });

            if (updated) {
                const reservaAtualizada = await db.Reserva.findByPk(reservaId, {
                    include: [
                        { model: db.Cliente, as: 'cliente' },
                        { model: db.Quarto, as: 'quarto' }
                    ]
                });
                res.status(200).json(reservaAtualizada);
            } else {
                res.status(404).json({ error: 'Reserva não encontrada' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao atualizar reserva' });
        }
    },

    async deleteReserva(req, res) {
        try {
            const deleted = await db.Reserva.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Reserva não encontrada' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao deletar reserva' });
        }
    }
};
