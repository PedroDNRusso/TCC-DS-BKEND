const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET_MED || "fallback_secret"; // evita undefined

async function gerarIDUnico() {
    let idValido = false;
    let novoId;

    while (!idValido) {
        novoId = Math.floor(10000 + Math.random() * 10000); // Número entre 1000 e 9999

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
    const { nome, crm, email, senha, cpf, telefone, data_nascimento, endereco, especialidade } = req.body;
    console.log('Dados recebidos:', req.body);

    try {
        const id = await gerarIDUnico();
        const hashedSenha = await bcrypt.hash(senha, 10);

        const medico = await prisma.medico.create({
            data: { id, nome, crm, email, senha: hashedSenha, cpf, telefone, data_nascimento, endereco, especialidade },
        });
        console.log('medico criado:', medico);
        res.status(201).json(medico);
    } catch (err) {
        console.error('Erro ao criar medico:', err);
        res.status(400).json(err);
    }
};

const read = async (req, res) => {
    const medicos = await prisma.medico.findMany();
    res.json(medicos);
}

const readOne = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: 'ID inválido ou ausente' });
    }
    try {
        const medico = await prisma.medico.findUnique({
            where: { id: Number(id) },
            include:{
            atestado:true
        }
        });
        if (!medico) {
            return res.status(404).json({ message: 'medico não encontrado' });
        }
        res.status(200).json(medico);
    } catch (err) {
        console.error('Erro ao buscar medico por ID:', err);
        res.status(500).json({ message: 'Erro ao buscar medico' });
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body; 
    console.log('Tentativa de login:', req.body);
    try {
        const medico = await prisma.medico.findFirst({
            where: { email },
        });

        if (!medico) {
            console.log('❌ Usuário não encontrado');
            return res.status(401).json({ message: 'Usuário ou senha incorretos' });
        }

        const senhaCorreta = await bcrypt.compare(senha, medico.senha);
        console.log('🔍 Comparação de senha correta?', senhaCorreta);

        if (senhaCorreta) {
            const token = jwt.sign(
                { id: medico.id, email: medico.email },
                jwtSecret,
                { expiresIn: '1h' }
            );
            return res.status(200).json({
                    id: medico.id,
                    crm: medico.crm,
                    nome: medico.nome,
                    email: medico.email,
                    cpf: medico.cpf,
                    telefone: medico.telefone,
                    data_nascimento: medico.data_nascimento,
                    endereco: medico.endereco,
                    especialidade: medico.especialidade,
                    token,
                    message: 'Login bem-sucedido'
                });
            } else {
                console.log('CRM ou senha incorretas');
                res.status(401).json({ message: 'CRM ou senha incorretas' });
            }
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
};

const deletar = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: 'ID inválido ou ausente' });
    }
    try {
        const medicoExistente = await prisma.medico.findUnique({ where: { id: Number(id) } });

        if (!medicoExistente) {
            console.log('medico não encontrado para exclusão');
            return res.status(404).json({ message: 'medico não encontrado' });
        }

        await prisma.medico.delete({ where: { id: Number(id) } });
        console.log('medico excluído com sucesso');
        res.status(200).json({ message: 'medico excluído com sucesso' });
    } catch (err) {
        console.error('Erro ao excluir medico:', err);
        res.status(500).json({ message: 'Erro ao excluir medico' });
    }
}

const update = async (req, res) => {
    const { id, nome, crm, email, senha , cpf, telefone, data_nascimento, endereco, especialidade } = req.body;
    console.log('Requisição de atualização:', req.body);

    // Validação do ID
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
        const medicoExistente = await prisma.medico.findUnique({ where: { id: Number(id) } });

        if (!medicoExistente) {
            console.log('medico não encontrado para atualização');
            return res.status(404).json({ message: 'medico não encontrado' });
        }

        let hashedSenha = medicoExistente.senha;
        if (senha) {
            hashedSenha = await bcrypt.hash(senha, 10);
        }

        const medicoAtualizado = await prisma.medico.update({
            where: { id: Number(id) },
            data: { nome, crm, email, senha: hashedSenha, cpf, telefone, endereco, especialidade, data_nascimento: dataNascimentoFormatada },
        });

        console.log('medico atualizado com sucesso:', medicoAtualizado);
        res.status(200).json(medicoAtualizado);
    } catch (err) {
        console.error('Erro ao atualizar medico:', err);
        res.status(500).json({ message: 'Erro ao atualizar medico' });
    }
};




module.exports = {
    create,
    login,
    read,
    readOne,
    deletar,
    update,
};