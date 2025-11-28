module.exports = (sequelize, Sequelize) => {
    const Quarto = sequelize.define('quarto', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        numero: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        tipo: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: 'Simples, Duplo ou Suíte'
        },
        preco: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        disponivel: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    });
    return Quarto;
}
