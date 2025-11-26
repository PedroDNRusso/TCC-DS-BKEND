const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || "fallback_secret";

async function gerarIDUnico() {
    let idValido = false;
    let novoId;

    while (!idValido) {
        novoId = Math.floor(1000 + Math.random() * 1000); // Número entre 1000 e 9999

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
    const { pacienteId, medicoId, mensagem } = req.body;
    console.log('Dados recebidos:', req.body);

    try {
        const id = await gerarIDUnico();

        const func_ui = await prisma.func_Ui.create({
            data: { id, pacienteId: Number(pacienteId), medicoId: Number(medicoId), mensagem},
        });
        console.log('Mensagem criada:', func_ui);
        res.status(201).json(func_ui);
    } catch (err) {
        console.error('Erro ao criar mensagem:', err);
        res.status(400).json(err);
    }
};

const read = async (req, res) => {
    const func_uis = await prisma.func_Ui.findMany();
    res.json(func_uis);
}

const readOne = async (req, res) => {
    const { medicoId } = req.params;

    if (!medicoId || isNaN(Number(medicoId))) {
        return res.status(400).json({ message: 'ID do medico inválido' });
    }

    try {
        const mensagem = await prisma.func_Ui.findMany({
            where: {
                medicoId: Number(medicoId)
            }
        });

        if (mensagem.length === 0) {
            return res.status(404).json({ message: 'Nenhuma mensagem encontrado para este medico' });
        }

        res.status(200).json(mensagem);
    } catch (err) {
        console.error('Erro ao buscar mensagens por medico:', err);
        res.status(500).json({ message: 'Erro ao buscar mensagens por medico' });
    }
};

const deletar = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: 'ID inválido ou ausente' });
    }
    try {
        const func_uiExistente = await prisma.func_Ui.findUnique({ where: { id: Number(id) } });

        if (!func_uiExistente) {
            console.log('Mensagem não encontrado para exclusão');
            return res.status(404).json({ message: 'Mensagem não encontrado' });
        }

        await prisma.func_Ui.delete({ where: { id: Number(id) } });
        console.log('Mensagem excluído com sucesso');
        res.status(200).json({ message: 'Mensagem excluído com sucesso' });
    } catch (err) {
        console.error('Erro ao excluir mensagem:', err);
        res.status(500).json({ message: 'Erro ao excluir mensagem' });
    }
}

module.exports = {
    create,
    read,
    readOne, 
    deletar
};