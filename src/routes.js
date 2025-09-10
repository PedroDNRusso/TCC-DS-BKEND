const express = require('express');
const rota = express.Router();

const paciente = require('./controllers/paciente.js'); 
const medico = require('./controllers/medico.js');
const func_med = require('./controllers/func_med.js');
const mens_med = require('./controllers/mens_med.js');
const { validate } = require('./middleware/auth.js');
const { validateMED } = require('./middleware/authm.js');

rota.get('/', (req, res) => {
    const api = {
        titulo: 'API Estacionamento',
        versao: '1.0.0',
        rotas: [
            //Paciente
            { metodo: 'POST', caminho: '/pacientes' },
            { metodo: 'POST', caminho: '/pacienteslgn' },
            { metodo: 'GET', caminho: '/pacientes' },
            { metodo: 'GET', caminho: '/pacientes/:id' },
            { metodo: 'PUT', caminho: '/pacientes/:id' },
            { metodo: 'DELETE', caminho: '/pacientes/:id' },
            //Medico
            { metodo: 'POST', caminho: '/medicos' },
            { metodo: 'POST', caminho: '/medicoslgn' },
            { metodo: 'GET', caminho: '/medicos' },
            { metodo: 'GET', caminho: '/medicos/:id' },
            { metodo: 'PUT', caminho: '/medicos/:id' },
            { metodo: 'DELETE', caminho: '/medicos/:id' },
            //Funcao Medica
            { metodo: 'POST', caminho: '/funcmed' },
            { metodo: 'GET', caminho: '/funcmed' },
            { metodo: 'GET', caminho: '/funcmed/paciente/:pacienteId' },
            //Mensagem Medica
            { metodo: 'POST', caminho: '/mensmed' },
            { metodo: 'GET', caminho: '/mensmed' },
            { metodo: 'GET', caminho: '/mensmed/paciente/:pacienteId' },
            { metodo: 'DELETE', caminho: '/mensmed/:id' },
        ]
    }
    res.json(api);
});

//Rotas de paciente
rota.post('/pacientes', paciente.create); // Rota para cadastro de paciente
rota.post('/pacienteslgn', paciente.login); // Rota para login
rota.get('/pacientes/:id', validateMED, paciente.readOne); // Rota para ler paciente por ID
rota.get('/pacientes', validate, paciente.read); // Rota para ler todos os pacientes
rota.put('/pacientes/:id', validate, paciente.update); // Rota para atualizar paciente
rota.delete('/pacientes/:id', validate, paciente.deletar); // Rota para deletar paciente por ID

// Rota de medico
rota.post('/medicos', medico.create); // Rota para cadastro
rota.post('/medicoslgn', medico.login); // Rota para login
rota.get('/medicos', validateMED, medico.read); // Rota para ler todos os enfermiros
rota.get('/medicos/:id', validateMED, medico.readOne); // Rota para ler medico por ID
rota.put('/medicos/:id', validateMED, medico.update); // Rota para update
rota.delete('/medicos/:id', validateMED, medico.deletar); // Rota para deletar medico por ID

// Rota de atestado
rota.post('/funcmed', validateMED, func_med.create); // Rota para criar atestado
rota.get('/funcmed', validate, func_med.read); // Rota para ler todos os atestados
rota.get('/funcmed/paciente/:pacienteId', validate, func_med.readOne);

// Rota de Mensagem de Médico
rota.post('/mensmed', validateMED, mens_med.create); // Rota para criar mensagem
rota.get('/mensmed', validate, mens_med.read); // Rota para ler todos os mensagens
rota.get('/mensmed/paciente/:pacienteId', validate, mens_med.readOne);
rota.delete('/mensmed/:id', validate, mens_med.deletar); // Rota para deletar mensagem por ID

module.exports = rota;