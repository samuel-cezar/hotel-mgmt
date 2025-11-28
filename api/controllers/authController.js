const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db_sequelize');

module.exports = {
    async login(req, res) {
        try {
            const { login, senha } = req.body;
            
            if (!login || !senha) {
                return res.status(400).json({ error: 'Login e senha são obrigatórios' });
            }

            const user = await db.Usuario.findOne({ where: { login } });

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const isPasswordValid = await bcrypt.compare(senha, user.senha);
            
            if (!isPasswordValid) {
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
        login: user.login
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });
    return token;
}