'use strict';

var expect = require('expect.js');
var express = require('express');

describe('Middleware injetar configurações na requisição', function () {
  var middleware, configurarApp, config, app, req;

  before(function () {
    config = require('../../config/TEST.json');

    configurarApp = require('../../middlewares/config');
  });


  beforeEach(function() {
    req = {};
    app = express();
    middleware = configurarApp(app, 'test');
  });


  it('deve definir a porta do servidor', function() {
    var portaEsperada = config.port;

    expect(app.get('porta')).to.be.equal(portaEsperada);
  });


  it('deve definir o segredo do servidor', function() {
    var segredoEsperado = config.secret;

    expect(app.get('secret')).to.be.equal(segredoEsperado);
  });


  it('deve definir a configuração da aplicação', function() {
    expect(app.get('config')).to.be.equal(config);
  });


  it('deve injetar uma propriedade com a configuração atual na requisição', function (done) {
    middleware(req, null, function (err) {
      expect(req).to.have.property('config').equal(config);
      done(err);
    });
  });
});
