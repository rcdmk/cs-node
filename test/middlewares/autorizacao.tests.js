'use strict';

var expect = require('expect.js');
var sinon = require('sinon');

describe('Middleware para autorização de rotas', function () {
  var middleware, app, config;

  beforeEach(function () {
    config = {
      secret: 'segredo'
    };

    app = {
      get: function() {
        return config;
      }
    };

    middleware = require('../../middlewares/autorizacao');
  });


  it('deve disparar um erro quando a aplicação ainda não foi configurada', function () {
    var erroEsperado = /É necessário configurar a aplicação antes de executar este módulo!/;

    app.get = function() {
      return;
    };

    expect(middleware).withArgs(app).to.throwException(erroEsperado);
  });


  it('deve obter a configuração da aplicação', function() {
    var spy = sinon.spy(app, 'get');

    middleware(app);

    expect(spy.firstCall.calledWithExactly('config')).to.be.ok();
  });


  it('deve aplicar o middleware JWT às rotas necessárias', function() {
    var rotasEsparadas = [
      '/usuarios',
      '/usuarios/',
      '/usuarios/:id_usuario',
      '/usuarios/:id_usuario/'
    ];

    var spy = sinon.spy(app, 'get');

    middleware(app);
    
    expect(spy.secondCall.calledWith(rotasEsparadas)).to.be.ok();
    expect(spy.secondCall.args[1]).to.be.a('function');
  });
});
