'use strict';

var debug = require('debug')('cs-node: ' + process.pid);
var mongoose = require('mongoose');

/**
 * Configura a conecta a um servidor do MongoDB
 * @param opcoes {Object} Mapa de configurações de conecção do banco de dados
 * @remarks Variáveis de ambiente sobrescrevem as configurações (eg.: DB_USER, DB_PASS e DB_URL)
 */
var configurarMongoose = function configMongoose(opcoes) {
    // configurar mongo (variáveis de ambiente sobrescrevem configurações)
    mongoose.connect(process.env.DB_URL || opcoes.url, {
        user: process.env.DB_USER || opcoes.user,
        pass: process.env.DB_PASS || opcoes.password
    });

    mongoose.connection.on('error', function (err) {
        console.error("Erro ao conectar ao MongoDB");
        debug('Erro ao conectar ao MongoDB: ' + err);
        process.exit();
    });
};

module.exports = configurarMongoose;