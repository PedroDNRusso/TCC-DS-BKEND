const express = require('express');
const rota = express.Router();

const paciente = require('./controllers/paciente.js'); 
const enfermeiro = require('./controllers/enfermeiro.js'); 
const medico = require('./controllers/medico.js');
const func_med = require('./controllers/func_med.js');
const Login = require('./controllers/loginp.js');
const MiddlewareAuth = require('./middleware/auth.js');

rota.get('/', (req, res) => {
    res.json({ titulo: 'API DD respondendo' });
});

rota.post('/loginp', Login.login); // Rota para cadastro de paciente
rota.get('/loginp', Login.validaToken); // Rota para ler todos os pacientes

//Rotas de paciente
rota.post('/pacientes', paciente.create); // Rota para cadastro de paciente
rota.get('/pacientes', MiddlewareAuth.validate, paciente.read); // Rota para ler todos os pacientes
rota.put('/pacientes/:id', MiddlewareAuth.validate, paciente.update); // Rota para atualizar paciente
rota.get('/pacientes/:id', MiddlewareAuth.validate, paciente.readOne); // Rota para ler paciente por ID
rota.delete('/pacientes/:id', MiddlewareAuth.validate, paciente.deletar); // Rota para deletar paciente por ID

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

module.exports = rota;