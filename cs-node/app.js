'use strict';

var express = require('express');
var debug = require('debug')('cs-node: ' + process.pid);
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('express-method-override');
var helmet = require('helmet');
var mongoose = require('mongoose');
var jwt = require('express-jwt');

var config = require('./config')(process.env.NODE_ENV);

var validacao = require('./middlewares/validacao.js');

var contollers = require('./controllers');

var erro404 = require('./middlewares/erro404');
var gerenciadorDeErros = require('./middlewares/gerenciador_erros');

// Definção da aplicação
var app = express();

// configurações
app.set('port', config.porta || process.env.PORT || 3000);
app.set('secret', config.secret);
app.set('config', config);

mongoose.connect(config.database);
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

app.use(function configMiddleware(req, res, next) {
	req.config = config;

	next();
});

// segurança com token
app.use(jwt({ secret: config.secret }).unless({ path: [ '/usuarios', '/autenticacao' ] }));


// validação de entrada
app.use(validacao());


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
