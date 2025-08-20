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
    const { nome_pac, nome_med, crm_med, cpf_pac, data, afast_o, afast_c, motivo, ass_med, pacienteId, medicoId } = req.body;
    console.log('Dados recebidos:', req.body);

    let data_consulta = null;
    if (data) {
        try {
            data_consulta = new Date(data);
            if (isNaN(data_consulta.getTime())) {
                return res.status(400).json({ message: 'data_nascimento inválida' });
            }
        } catch {
            return res.status(400).json({ message: 'data_nascimento inválida' });
        }
    }

    let data_o = null;
    if (afast_o) {
        try {
            data_o = new Date(afast_o);
            if (isNaN(data_o.getTime())) {
                return res.status(400).json({ message: 'data_nascimento inválida' });
            }
        } catch {
            return res.status(400).json({ message: 'data_nascimento inválida' });
        }
    }

    let data_c = null;
    if (afast_c) {
        try {
            data_c = new Date(afast_c);
            if (isNaN(data_c.getTime())) {
                return res.status(400).json({ message: 'data_nascimento inválida' });
            }
        } catch {
            return res.status(400).json({ message: 'data_nascimento inválida' });
        }
    }

    try {
        const id = await gerarIDUnico();

        const func_med = await prisma.func_Med.create({
            data: { id, nome_pac, nome_med, crm_med, cpf_pac, data: data_consulta , afast_o: data_o, afast_c: data_c, motivo, ass_med, pacienteId: Number(pacienteId), medicoId: Number(medicoId) },
        });
        console.log('Atestado criado:', func_med);
        res.status(201).json(func_med);
    } catch (err) {
        console.error('Erro ao criar atestado:', err);
        res.status(400).json(err);
    }
};

const read = async (req, res) => {
    const func_meds = await prisma.func_Med.findMany();
    res.json(func_meds);
}

const readOne = async (req, res) => {
    const { pacienteId } = req.params;

    if (!pacienteId || isNaN(Number(pacienteId))) {
        return res.status(400).json({ message: 'ID do paciente inválido' });
    }

    try {
        const atestados = await prisma.func_Med.findMany({
            where: {
                pacienteId: Number(pacienteId)
            }
        });

        if (atestados.length === 0) {
            return res.status(404).json({ message: 'Nenhum atestado encontrado para este paciente' });
        }

        res.status(200).json(atestados);
    } catch (err) {
        console.error('Erro ao buscar atestados por paciente:', err);
        res.status(500).json({ message: 'Erro ao buscar atestados por paciente' });
    }
};

module.exports = {
    create,
    read,
    readOne
};