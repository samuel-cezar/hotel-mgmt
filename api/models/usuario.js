module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    });

    return Usuario;
};
