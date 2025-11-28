module.exports = (sequelize, Sequelize) => {
    const Reserva = sequelize.define('reserva', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        clienteId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'clientes',
                key: 'id'
            }
        },
        quartoId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'quartos',
                key: 'id'
            }
        },
        data_entrada: {
            type: Sequelize.DATE,
            allowNull: false
        },
        data_saida: {
            type: Sequelize.DATE,
            allowNull: false
        },
        valor_total: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        }
    });
    return Reserva;
}
