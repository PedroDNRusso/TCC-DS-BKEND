const prisma = require('../connect');

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
    const { pacienteId, medicoId, mensagem, nome_pac } = req.body;
    console.log('Dados recebidos:', req.body);

    try {
        const id = await gerarIDUnico();

        const mens_med = await prisma.mens_Med.create({
            data: { id, pacienteId: Number(pacienteId), medicoId: Number(medicoId), mensagem, nome_pac },
        });
        console.log('Mensagem criada:', mens_med);
        res.status(201).json(mens_med);
    } catch (err) {
        console.error('Erro ao criar mensagem:', err);
        res.status(400).json(err);
    }
};

const read = async (req, res) => {
    const mens_meds = await prisma.mens_Med.findMany();
    res.json(mens_meds);
}

const readOne = async (req, res) => {
    const { pacienteId } = req.params;

    if (!pacienteId || isNaN(Number(pacienteId))) {
        return res.status(400).json({ message: 'ID do paciente inválido' });
    }

    try {
        const mensagem = await prisma.mens_Med.findMany({
            where: {
                pacienteId: Number(pacienteId)
            }
        });

        if (mensagem.length === 0) {
            return res.status(404).json({ message: 'Nenhuma mensagem encontrado para este paciente' });
        }

        res.status(200).json(mensagem);
    } catch (err) {
        console.error('Erro ao buscar mensagens por paciente:', err);
        res.status(500).json({ message: 'Erro ao buscar mensagens por paciente' });
    }
};

const deletar = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: 'ID inválido ou ausente' });
    }
    try {
        const mens_medExistente = await prisma.mens_Med.findUnique({ where: { id: Number(id) } });

        if (!mens_medExistente) {
            console.log('Mensagem não encontrado para exclusão');
            return res.status(404).json({ message: 'Mensagem não encontrado' });
        }

        await prisma.mens_Med.delete({ where: { id: Number(id) } });
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