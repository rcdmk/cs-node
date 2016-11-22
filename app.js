'use strict';

var express = require('express');
var debug = require('debug')('cs-node: ' + process.pid);
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('express-method-override');
var helmet = require('helmet');
var mongoose = require('mongoose');


var configurar = require('./middlewares/config');
var validacao = require('./middlewares/validacao');
var configurarAutorizacao = require('./middlewares/autorizacao')

var contollers = require('./controllers');

var erro404 = require('./middlewares/erro404');
var gerenciadorDeErros = require('./middlewares/gerenciador_erros');

// Definção da aplicação
var app = express();

// configurações
configurar(app, process.env.NODE_ENV);

var appConfig = app.get('config');

// configurar mongo
mongoose.connect(appConfig.database);
mongoose.connection.on('error', function (err) {
  console.error("Erro ao conectar ao MongoDB");
  debug('Erro ao conectar ao MongoDB: ' + err);
  process.exit();
});


// configurar middlewares padrão
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride());
app.use(helmet());

// validação de entrada
app.use(validacao());

// segurança com token
configurarAutorizacao(app);

// configurar rotas
contollers.carregarControllers(app, function (err) {
  if (err) {
    debug('Erro ao carregar rotas!');
  } else {
    // tratamento de erros
    app.use(erro404);
    app.use(gerenciadorDeErros);
  }
});


module.exports = app;
