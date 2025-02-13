'use strict';

var expect = require('expect.js');
var rewire = require('rewire');
var sinon = require('sinon');

describe('Módulo de Configuração do Mongoose', function() {
    var modulo, mongooseMock, fakes, config;

    before(function() {
        config = require('../../config/TEST.json');
        modulo = rewire('../../utils/mongoose');
    });

    beforeEach(function() {
        fakes = sinon.sandbox.create();

        mongooseMock = sinon.stub({
            connect: function(){
                return;
            },
            connection: {
                on: function() {
                    return;
                }
            }
        });

        modulo.__set__('mongoose',  mongooseMock);
    });


    afterEach(function() {
        fakes.restore();
    })

    it('deve exportar um método para configurar a conexão', function() {
        expect(modulo).to.be.a('function');
    });

    it('deve utilizar as configurações da aplicação para a conexão', function() {
        var dadosEsperados = {
            user: config.database.user,
            pass: config.database.password
        };

        modulo(config.database);

        expect(mongooseMock.connect.callCount).to.be.equal(1);
        expect(mongooseMock.connect.firstCall.args).to.have.length(2);
        expect(mongooseMock.connect.firstCall.args[0]).to.be.equal(config.database.url);
        expect(mongooseMock.connect.firstCall.args[1]).to.be.eql(dadosEsperados);
    });


    it('deve utilizar as configurações do ambiente caso existam', function() {
        var dadosEsperados = {
            user: 'dbuser',
            pass: 'dbpass'
        };

        process.env.DB_URL = 'dburl';
        process.env.DB_USER = dadosEsperados.user;
        process.env.DB_PASS = dadosEsperados.pass;
        modulo.__set__('process', process);

        modulo(config.database);

        expect(mongooseMock.connect.callCount).to.be.equal(1);
        expect(mongooseMock.connect.firstCall.args).to.have.length(2);
        expect(mongooseMock.connect.firstCall.args[0]).to.be.equal('dburl');
        expect(mongooseMock.connect.firstCall.args[1]).to.be.eql(dadosEsperados);
    });
});