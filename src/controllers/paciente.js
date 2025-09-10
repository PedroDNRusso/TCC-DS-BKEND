const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || "fallback_secret"; // evita undefined

async function gerarIDUnico() {
    let idValido = false;
    let novoId;

    while (!idValido) {
        novoId = Math.floor(1000 + Math.random() * 9000); // Número entre 1000 e 9999

        const existe = await prisma.paciente.findUnique({
            where: { id: novoId },
        });

        if (!existe) {
            idValido = true;
        }
    }

    return novoId;
}

const create = async (req, res) => {
    const { nome, email, senha, cpf, data_nascimento, endereco, telefone } = req.body;
    console.log('📥 Dados recebidos no create:', req.body);

    try {
        const id = await gerarIDUnico();
        const hashedSenha = await bcrypt.hash(senha, 10);

        console.log("🔑 Senha recebida:", senha);
        console.log("🔒 Senha hash gerada:", hashedSenha);

        const paciente = await prisma.paciente.create({
            data: { id, nome, email, senha: hashedSenha, cpf, data_nascimento, endereco, telefone },
        });

        console.log('✅ Usuário criado:', paciente);
        res.status(201).json(paciente);
    } catch (err) {
        console.error('❌ Erro ao criar usuário:', err);
        res.status(400).json(err);
    }
};

const read = async (req, res) => {
    const pacientes = await prisma.paciente.findMany();
    res.json(pacientes);
}

const readOne = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: 'ID inválido ou ausente' });
    }
    try {
        const paciente = await prisma.paciente.findUnique({
            where: { id: Number(id) },
            include: {
                atestado: true,
                mensagens: true,
            }
        });
        if (!paciente) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }
        res.status(200).json(paciente);
    } catch (err) {
        console.error('❌ Erro ao buscar paciente por ID:', err);
        res.status(500).json({ message: 'Erro ao buscar paciente' });
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;
    console.log('📥 Tentativa de login:', req.body);
    try {
        // 🔄 Troquei para findFirst (garante que acha mesmo sem @unique)
        const paciente = await prisma.paciente.findFirst({
            where: { email },
        });
        console.log('🔎 Paciente encontrado:', paciente);

        if (!paciente) {
            console.log('❌ Usuário não encontrado');
            return res.status(401).json({ message: 'Usuário ou senha incorretos' });
        }


        const senhaCorreta = await bcrypt.compare(senha, paciente.senha);
        console.log('🔍 Comparação de senha correta?', senhaCorreta);

        if (senhaCorreta) {
            const token = jwt.sign(
                { id: paciente.id, email: paciente.email },
                jwtSecret,
                { expiresIn: '1h' }
            );
            console.log('✅ Login bem-sucedido:', paciente);
            return res.status(200).json({
                id: paciente.id,
                nome: paciente.nome,
                email: paciente.email,
                cpf: paciente.cpf,
                telefone: paciente.telefone,
                data_nascimento: paciente.data_nascimento,
                endereco: paciente.endereco,
                token,
                message: 'Login bem-sucedido'
            });
        } else {
            console.log('❌ Senha incorreta');
            return res.status(401).json({ message: 'Usuário ou senha incorretos' });
        }
    } catch (err) {
        console.error('❌ Erro no login:', err);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
};

const deletar = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: 'ID inválido ou ausente' });
    }
    try {
        const pacienteExistente = await prisma.paciente.findUnique({ where: { id: Number(id) } });

        if (!pacienteExistente) {
            console.log('❌ Paciente não encontrado para exclusão');
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }

        await prisma.paciente.delete({ where: { id: Number(id) } });
        console.log('🗑️ Paciente excluído com sucesso');
        res.status(200).json({ message: 'Paciente excluído com sucesso' });
    } catch (err) {
        console.error('❌ Erro ao excluir paciente:', err);
        res.status(500).json({ message: 'Erro ao excluir paciente' });
    }
}

const update = async (req, res) => {
    const { id, nome, email, senha, cpf, telefone, data_nascimento, endereco } = req.body;
    console.log('📥 Requisição de atualização:', req.body);

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: 'ID inválido ou ausente' });
    }

    let dataNascimentoFormatada = null;
    if (data_nascimento) {
        try {
            dataNascimentoFormatada = new Date(data_nascimento);
            if (isNaN(dataNascimentoFormatada.getTime())) {
                return res.status(400).json({ message: 'data_nascimento inválida' });
            }
        } catch {
            return res.status(400).json({ message: 'data_nascimento inválida' });
        }
    }

    try {
        const pacienteExistente = await prisma.paciente.findUnique({ where: { id: Number(id) } });

        if (!pacienteExistente) {
            console.log('❌ Paciente não encontrado para atualização');
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }

        let hashedSenha = pacienteExistente.senha;
        if (senha) {
            hashedSenha = await bcrypt.hash(senha, 10);
        }

        const pacienteAtualizado = await prisma.paciente.update({
            where: { id: Number(id) },
            data: { nome, email, senha: hashedSenha, cpf, telefone, data_nascimento: dataNascimentoFormatada, endereco },
        });

        console.log('✅ Paciente atualizado com sucesso:', pacienteAtualizado);
        res.status(200).json(pacienteAtualizado);
    } catch (err) {
        console.error('❌ Erro ao atualizar paciente:', err);
        res.status(500).json({ message: 'Erro ao atualizar paciente' });
    }
}; 

module.exports = {
    create,
    login,
    read,
    readOne,
    deletar,
    update
};
