'use strict';

var fs = require('fs');
var debug = require('debug')('cs-node: ' + process.pid);
var mongoose = require('mongoose');

/**
 * Carrega arquivos de controllers
 */
var carregaControllerDoArquivo = function carregaControllerDoArquivo(app, arquivo) {
	if (arquivo !== 'index.js' && arquivo.substr(-3) === '.js') {
		var nome = arquivo.substr(0, arquivo.length - 3);
		var controller = require('./' + arquivo);
		
		app.use('/' + nome, controller(app, mongoose));

		debug('Carregadas rotas de /' + nome);
	}
};


/**
 * Carrega todos os controllers da pasta controllers
 * @param app {Object} Uma instância de uma aplicação Express
 * @param done {Function} Uma função de callback para executar ao concluir execução
 */
var CarregarControllers = function CarregarControllers(app, done) {
    fs.readdir(__dirname, function (err, arquivos) {
        if (err) {
            return done(err);
        }

		arquivos.forEach(function (arquivo) {
			carregaControllerDoArquivo(app, arquivo);
		});

        done();
    });
}


module.exports.carregarControllers = CarregarControllers;