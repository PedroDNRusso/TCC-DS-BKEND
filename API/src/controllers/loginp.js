const jsonwebtoken = require("jsonwebtoken");
const Middlewares = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const login = async (req, res) => {
    const { email, senha, validade } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    try {
        const paciente = await prisma.paciente.findFirst({
            where: { 
                email: email
            }
        });

        if (!paciente) {
            return res.status(401).json({ message: 'E-mail ou Senha incorretos!' });
        }

        const isValidPassword = await Middlewares.validatePassword(senha, paciente.senha);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'E-mail ou Senha incorretos!' });
        }

        const token = jsonwebtoken.sign(
            {
                id: paciente.id,
                nome: paciente.nome,
                email: paciente.email,
            },
            process.env.SECRET_JWT,
            { expiresIn: validade && !isNaN(validade) ? `${validade}m` : "60m" }
        );

        return res.status(200).json({ token });
    } catch (err) {
        console.error('Erro no login:', err);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const validaToken = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).send({ message: "Acesso negado. Nenhum token recebido." }).end();
    }

    jsonwebtoken.verify(token, process.env.SECRET_JWT, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "Token inválido ou expirado." }).end();
        }
        req.user = decoded;
        res.status(200).json({ message: req.user });
    });
}

module.exports = {
    login,
    validaToken
};
