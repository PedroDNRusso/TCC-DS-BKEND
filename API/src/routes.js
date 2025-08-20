const express = require('express');
const rota = express.Router();

const paciente = require('./controllers/paciente.js'); 
const enfermeiro = require('./controllers/enfermeiro.js'); 
const medico = require('./controllers/medico.js');
const func_med = require('./controllers/func_med.js');
const mens_med = require('./controllers/mens_med.js');

rota.get('/', (req, res) => {
    res.json({ titulo: 'API DD respondendo' });
});

//Rotas de paciente
rota.post('/pacientes', paciente.create); // Rota para cadastro de paciente
rota.post('/pacientes', paciente.login); // Rota para login
rota.get('/pacientes', paciente.read); // Rota para ler todos os pacientes
rota.put('/pacientes/:id', paciente.update); // Rota para atualizar paciente
rota.get('/pacientes/:id', paciente.readOne); // Rota para ler paciente por ID
rota.delete('/pacientes/:id', paciente.deletar); // Rota para deletar paciente por ID

// Rota de enfermeiro
rota.post('/enfermeiros', enfermeiro.create); // Rota para cadastro
rota.post('/enfermeiros', enfermeiro.login); // Rota para login
rota.get('/enfermeiros', enfermeiro.read); // Rota para ler todos os enfermiros
rota.put('/enfermeiros/:id', enfermeiro.update); // Rota para update
rota.get('/enfermeiros/:id', enfermeiro.readOne); // Rota para ler enfermeiro por ID
rota.delete('/enfermeiros/:id', enfermeiro.deletar); // Rota para deletar enfermeiro por ID

// Rota de medico
rota.post('/medicos', medico.create); // Rota para cadastro
rota.post('/medicos', medico.login); // Rota para login
rota.get('/medicos', medico.read); // Rota para ler todos os enfermiros
rota.put('/medicos/:id', medico.update); // Rota para update
rota.get('/medicos/:id', medico.readOne); // Rota para ler medico por ID
rota.delete('/medicos/:id', medico.deletar); // Rota para deletar medico por ID

// Rota de atestado
rota.post('/funcmed', func_med.create); // Rota para criar atestado
rota.get('/funcmed', func_med.read); // Rota para ler todos os atestados
rota.get('/funcmed/paciente/:pacienteId', func_med.readOne);

// Rota de Mensagem de Médico
rota.post('/mensmed', mens_med.create); // Rota para criar mensagem
rota.get('/mensmed', mens_med.read); // Rota para ler todos os mensagens
rota.get('/mensmed/paciente/:pacienteId', mens_med.readOne);
rota.delete('/mensmed/:id', mens_med.deletar); // Rota para deletar mensagem por ID

module.exports = rota;