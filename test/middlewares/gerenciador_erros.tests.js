'use strict';

var expect = require('expect.js');

describe('Middleware para tratamento de erros', function () {
  var middleware, req, res, next;
  
  before(function () {
    req = {
      config: {
        embiente: 'tests'
      },
      headers: {
        h: 0
      },
      params: {
        p: 1
      },
      query: {
        q: 2
      },
      body: {
        b: 3
      }
    };
    
    res = {
      status: function () {
        return res;
      },
      json: function () {
      }
    };
    
    next = function () { };
    
    middleware = require('../../middlewares/gerenciador_erros');
  });
  
  
  it('deve retornar o objeto de erro com os parâmetros corretos para erro de autorização (UnauthorizedError)', function (done) {
    var erro = new Error('Não autorizado');
    erro.name = 'UnauthorizedError';
    
    var erroEsperado = {
      mensagem: 'Não autorizado'
    };
    
    res.status = function (status) {
      expect(status).to.be.equal(401);
    };
    
    res.json = function (dados) {
      expect(dados).to.be.eql(erroEsperado);
      done();
    };
    
    middleware(erro, req, res, next);
  });
  
  
  it('deve retornar o objeto de erro com os parâmetros corretos para erro de sessão expirada (UnauthorizedError)', function (done) {
    var erro = new Error('jwt expired');
    erro.name = 'UnauthorizedError';
    
    var erroEsperado = {
      mensagem: 'Sessão inválida'
    };
    
    res.status = function (status) {
      expect(status).to.be.equal(401);
    };
    
    res.json = function (dados) {
      expect(dados).to.be.eql(erroEsperado);
      done();
    };
    
    middleware(erro, req, res, next);
  });
  
  
  it('deve retornar o objeto de erro com os parâmetros corretos para outros erros', function (done) {
    var erro = new Error('Erro!!!');
    
    var erroEsperado = {
      mensagem: 'Erro!!!'
    };
    
    res.status = function (status) {
      expect(status).to.be.equal(500);
    };
    
    res.json = function (dados) {
      expect(dados).to.be.eql(erroEsperado);
      done();
    };
    
    middleware(erro, req, res, next);
  });
  
  
  it('deve retornar o objeto de erro com os detalhes do erro e parâmetros da requisição', function (done) {
    req.config.ambiente = 'desenvolvimento';
    
    var erro = new Error('Outro erro');
    
    var erroEsperado = {
      mensagem: 'Outro erro',
      req: {
        headers: {
          h: 0
        },
        params: {
          p: 1
        },
        query: {
          q: 2
        },
        body: {
          b: 3
        }
      },
      erro: erro
    };
    
    res.status = function (status) {
      expect(status).to.be.equal(500);
    };
    
    res.json = function (dados) {
      expect(dados.mensagem).to.be.equal(erroEsperado.mensagem);
      expect(dados.req).to.be.eql(erroEsperado.req);
      expect(dados.erro).to.be.contain(erroEsperado.erro);
      done();
    };
    
    middleware(erro, req, res, next);
  });
});
