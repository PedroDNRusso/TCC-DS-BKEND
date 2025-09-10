const express = require('express');
const rota = express.Router();

const paciente = require('./controllers/paciente.js'); 
const medico = require('./controllers/medico.js');
const func_med = require('./controllers/func_med.js');
const mens_med = require('./controllers/mens_med.js');
const { validate } = require('./middlewares/auth.js');
const { validateMED } = require('./middlewares/authm.js');

rota.get('/', (req, res) => {
    res.json({ titulo: 'API DD respondendo' });
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
rota.put('/medicos/:id', validateMED, medico.update); // Rota para update
rota.get('/medicos/:id', validateMED, medico.readOne); // Rota para ler medico por ID
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