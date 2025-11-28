const jwt = require('jsonwebtoken');
const db = require('../config/db_sequelize');
const secretKey = 'your_secret_key';

module.exports = {
    async login(req, res) {
        try {
            const { login, senha } = req.body;
            const user = await db.Usuario.findOne({ where: { login:req.body.login } });

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            if (senha != user.senha) {
                return res.status(401).json({ error: 'Senha incorreta' });
            }

            const token = generateToken(user);
            res.status(200).json({ token });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao fazer login' });
        }
    }
};

function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    return token;
}