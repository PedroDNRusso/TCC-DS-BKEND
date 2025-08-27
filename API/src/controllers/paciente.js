const prisma = require('../connect');
const Middlewares = require('../middleware/auth');

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
    console.log('Dados recebidos:', req.body);
    try {
        // Verifica se o e-mail já está cadastrado
        const existente = await prisma.paciente.findUnique({ where: { email } });
        if (existente) {
            return res.status(409).json({ message: 'E-mail já cadastrado!' });
        }

        const id = await gerarIDUnico();
        const senhaHash = await Middlewares.createHash(senha);
        const paciente = await prisma.paciente.create({
            data: { id, nome, email, senha: senhaHash, cpf, data_nascimento, endereco, telefone },
        });

        console.log('Usuário criado:', paciente);
        res.status(201).json(paciente);
    } catch (err) {
        console.error('Erro ao criar usuário:', err);
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
             include:{
            atestado:true,
            mensagens:true,
        }
        });
        if (!paciente) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }
        res.status(200).json(paciente);
    } catch (err) {
        console.error('Erro ao buscar paciente por ID:', err);
        res.status(500).json({ message: 'Erro ao buscar paciente' });
    }
};

const deletar = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: 'ID inválido ou ausenteasas' });
    }
    try {
        const pacienteExistente = await prisma.paciente.findUnique({ where: { id: Number(id) } });

        if (!pacienteExistente) {
            console.log('Paciente não encontrado para exclusão');
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }

        await prisma.paciente.delete({ where: { id: Number(id) } });
        console.log('Paciente excluído com sucesso');
        res.status(200).json({ message: 'Paciente excluído com sucesso' });
    } catch (err) {
        console.error('Erro ao excluir paciente:', err);
        res.status(500).json({ message: 'Erro ao excluir paciente' });
    }
}

const update = async (req, res) => {
    const { id, nome, email, senha, cpf, telefone, data_nascimento, endereco } = req.body;
    console.log('Requisição de atualização:', req.body);

    if (req.body.senha) req.body.senha = await Middlewares.createHash(req.body.senha);
    try {

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
            console.log('Paciente não encontrado para atualização');
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }

        const pacienteAtualizado = await prisma.paciente.update({
            where: { id: Number(id) },
            data: { nome, email, senha, cpf, telefone, data_nascimento: dataNascimentoFormatada, endereco},
        });

        console.log('Paciente atualizado com sucesso:', pacienteAtualizado);
        res.status(200).json(pacienteAtualizado);
    } catch (err) {
        console.error('Erro ao atualizar paciente:', err);
        res.status(500).json({ message: 'Erro ao atualizar paciente' });
    }
    }
    catch (err) {
        console.error('Erro na atualização:', err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};


module.exports = {
    create,
    read,
    readOne,
    deletar,
    update
};