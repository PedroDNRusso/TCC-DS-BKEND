const prisma = require('../connect');

async function gerarIDUnico() {
    let idValido = false;
    let novoId;

    while (!idValido) {
        novoId = Math.floor(1000 + Math.random() * 100000); // Número entre 1000 e 9999

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
    const { nome, ecip, area, email, senha, cpf, telefone, data_nascimento, endereco } = req.body;
    console.log('Dados recebidos:', req.body);

    try {
        const id = await gerarIDUnico();

        const enfermeiro = await prisma.enfermeira.create({
            data: { id, nome, ecip, area, email, senha, cpf, telefone, data_nascimento, endereco },
        });
        console.log('Enfermeiro criado:', enfermeiro);
        res.status(201).json(enfermeiro);
    } catch (err) {
        console.error('Erro ao criar enfermeiro:', err);
        res.status(400).json(err);
    }
};

const read = async (req, res) => {
    const enfermeiros = await prisma.enfermeira.findMany();
    res.json(enfermeiros);
}

const readOne = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: 'ID inválido ou ausente' });
    }
    try {
        const enfermeira = await prisma.enfermeira.findUnique({
            where: { id: Number(id) }
        });
        if (!enfermeira) {
            return res.status(404).json({ message: 'enfermeira não encontrado' });
        }
        res.status(200).json(enfermeira);
    } catch (err) {
        console.error('Erro ao buscar enfermeira por ID:', err);
        res.status(500).json({ message: 'Erro ao buscar enfermeira' });
    }
};


const login = async (req, res) => {
    const { ecip, senha } = req.body; 
    console.log('Tentativa de login:', req.body);
    try {
        const enfermeiro = await prisma.enfermeira.findUnique({
            where: { ecip },
        });
        if (enfermeiro) {
            if (enfermeiro.senha === senha) {
                console.log('Login bem-sucedido:', enfermeiro);
                res.status(200).json({
                    id: enfermeiro.id,
                    ecip: enfermeiro.ecip,
                    area: enfermeiro.area,
                    nome: enfermeiro.nome,
                    email: enfermeiro.email,
                    senha: enfermeiro.senha, // Incluindo a senha para futuras requisições
                    cpf: enfermeiro.cpf,
                    telefone: enfermeiro.telefone,
                    data_nascimento: enfermeiro.data_nascimento,
                    endereco: enfermeiro.endereco,
                    message: 'Login bem-sucedido'
                });
            } else {
                console.log('e-CIP ou senha incorretas');
                res.status(401).json({ message: 'e-CIP ou senha incorretas' });
            }
        } else {
            console.log('Enfermeiro não encontrado');
            res.status(401).json({ message: 'Usuário não encontrado' });
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
        const enfermeiraExistente = await prisma.enfermeira.findUnique({ where: { id: Number(id) } });

        if (!enfermeiraExistente) {
            console.log('enfermeira não encontrado para exclusão');
            return res.status(404).json({ message: 'enfermeira não encontrado' });
        }

        await prisma.enfermeira.delete({ where: { id: Number(id) } });
        console.log('enfermeira excluído com sucesso');
        res.status(200).json({ message: 'enfermeira excluído com sucesso' });
    } catch (err) {
        console.error('Erro ao excluir enfermeira:', err);
        res.status(500).json({ message: 'Erro ao excluir enfermeira' });
    }
}

const update = async (req, res) => {
    const { id, ecip, area, nome, email, senha, cpf, telefone, data_nascimento, endereco } = req.body;
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
        const enfermeiroExistente = await prisma.enfermeira.findUnique({ where: { id: Number(id) } });

        if (!enfermeiroExistente) {
            console.log('Enfermeiro não encontrado para atualização');
            return res.status(404).json({ message: 'Enfermeiro não encontrado' });
        }

        const enfermeiroAtualizado = await prisma.enfermeira.update({
            where: { id: Number(id) },
            data: { ecip, nome, area, email, senha, cpf, telefone, endereco, data_nascimento: dataNascimentoFormatada },
        });

        console.log('Enfermeiro atualizado com sucesso:', enfermeiroAtualizado);
        res.status(200).json(enfermeiroAtualizado);
    } catch (err) {
        console.error('Erro ao atualizar enfermeiro:', err);
        res.status(500).json({ message: 'Erro ao atualizar enfermeiro' });
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