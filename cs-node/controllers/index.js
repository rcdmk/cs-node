'use strict';

var fs = require('fs');
var debug = require('debug')('cs-node: ' + process.pid);

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

        var nome, controller;

        arquivos.forEach(function carregaControllerDoArquivo(arquivo) {
            if (arquivo !== 'index.js' && arquivo.substr(-3) === '.js') {
                nome = arquivo.substr(0, arquivo.length - 3);
                controller = require('./' + arquivo);

                app.use('/' + nome, controller);
                debug('Carregadas rotas de /' + nome);
            }
        });

        done();
    });
}


module.exports.carregarControllers = CarregarControllers;