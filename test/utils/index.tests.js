'use strict';

var expect = require('expect.js');

describe('Módulo Utilidades', function() {
  var utils, res, erros;

  before(function() {
    utils = require('../../utils/');
  });

  beforeEach(function() {
    res = {
      status: function(status) {
        this.status = status;
        return this;
      },
      json: function(data) {
        return data;
      }
    };

    erros = [{
      erro: 1
    }];
  });

  it('deve exportar um formatador de erros de validação', function() {
    expect(utils).to.have.property('formatarErrosValidacao');
    expect(utils.formatarErrosValidacao).to.be.a('function');
  });

  it('deve exportar um formatador de erros 404', function() {
    expect(utils).to.have.property('retornarErro404');
    expect(utils.retornarErro404).to.be.a('function');
  });

  it('deve exportar um formatador de erros 503', function() {
    expect(utils).to.have.property('retornarErro503');
    expect(utils.retornarErro503).to.be.a('function');
  });

  describe('#formatarErrosValidacao(res, erros)', function() {
    it('deve configurar o status da requisição como 400', function() {
      res.status = function(status) {
        expect(status).to.be.equal(400);
        return this;
      };

      utils.formatarErrosValidacao(res, erros);
    });

    it('deve retornar um erro de validação formatado', function() {
      var formatoEsperado = {
        message: 'Alguns dados enviados são inválidos.',
        erros: erros
      };

      res.json = function(data) {
        expect(data).to.be.eql(formatoEsperado);
      };

      utils.formatarErrosValidacao(res, erros);
    });
  });


  describe('#retornarErro404(next)', function() {
    it('deve formatar o erro e repassá-lo para o callback next()', function(done) {
      var erroEsperado = {
        message: 'Recurso não encontrado',
        status: 404
      };

      var callback = function(err) {
        expect(err).to.be.eql(erroEsperado);
        done();
      };

      utils.retornarErro404(callback);
    });
  });


  describe('#retornarErro503(err, next)', function() {
    it('deve formatar o erro e repassá-lo para o callback next()', function(done) {
      var erroEsperado = {
        message: 'Serviço temporariamente indisponível',
        status: 503,
        err: erros
      };

      var callback = function(err) {
        expect(err).to.be.eql(erroEsperado);
        done();
      };

      utils.retornarErro503(erros, callback);
    });
  });
});
