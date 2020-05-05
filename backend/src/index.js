const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const routes = require('./routes'); // Importa as rotas

const app = express();

app.use(cors()); // em prod, deveríamos informar o "origin"
app.use(express.json());
app.use(routes);
app.use(errors());

app.listen(3333);