const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/nomeDoSeuBanco', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB:'));
db.once('open', () => {
  console.log('Conectado ao MongoDB');
});

// Definir o schema e o modelo
const personSchema = new mongoose.Schema({
  nome: String
});
const Person = mongoose.model('Person', personSchema);

// Rotas CRUD
// Criar uma pessoa
app.post('/pessoas', async (req, res) => {
  try {
    const novaPessoa = await Person.create(req.body);
    res.status(201).json(novaPessoa);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Ler todas as pessoas
app.get('/pessoas', async (req, res) => {
  try {
    const pessoas = await Person.find();
    res.json(pessoas);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Atualizar uma pessoa pelo ID
app.put('/pessoas/:id', async (req, res) => {
  try {
    const pessoa = await Person.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(pessoa);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deletar uma pessoa pelo ID
app.delete('/pessoas/:id', async (req, res) => {
  try {
    await Person.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

