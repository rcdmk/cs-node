'use strict';

var expect = require('expect.js');

describe('Middleware Validação', function () {
  var middleware, req, res, validador;
  
  before(function () {
    req = {
      body: {
        nome_campo: 'a'
      }
    };
    res = {};
    
    middleware = require('../../middlewares/validacao');
  });
  
  beforeEach(function () {
    validador = middleware();
  });
  
  it('deve retornar uma istância do middleware de validação do express-validator configurada', function (done) {
    expect(validador).to.be.a('function');
    
    validador(req, res, function () {
      expect(req).to.have.property('validationErrors');
      expect(req.validationErrors).to.be.a('function');
      
      expect(req).to.have.property('_validationErrors');
      expect(req._validationErrors).to.be.an('array');
      expect(req._validationErrors).to.have.length(0);
      done();
    });
  });
  
  
  it('deve formatar os erros de validação no padrão esperado', function (done) {
    validador(req, res, function () {
      req.checkBody('nao_existe', 'Campo deve ser preenchido').notEmpty();
      req.checkBody('nome_campo', 'Campo deve ser numérico').isNumeric();
      
      var erros = req.validationErrors();
      
      expect(erros).to.be.an('array');
      expect(erros).to.have.length(2);
      
      var erro = erros.shift();
      
      expect(erro).to.have.property('parametro').equal('nao_existe');
      expect(erro).to.have.property('mensagem').equal('Campo deve ser preenchido');
      expect(erro).to.have.property('valor').equal(undefined);
      
      erro = erros.shift();
      
      expect(erro).to.have.property('parametro').equal('nome_campo');
      expect(erro).to.have.property('mensagem').equal('Campo deve ser numérico');
      expect(erro).to.have.property('valor').equal('a');
      
      done();
    });
  });
  
  describe('deve fornecer um validador para arrays: isArray()', function () {
    it('que não deve gerar erros para arrays vazios', function (done) {
      validador(req, res, function () {
        req.body.lista = [];
        
        req.checkBody('lista', 'Campo deve ser uma lista').isArray();
        
        var erros = req.validationErrors();
        
        expect(erros).to.be(false);
        done();
      });
    });
    
    it('que não deve gerar erros para arrays preenchidos', function (done) {
      validador(req, res, function () {
        req.body.lista = [1, 2, 3];
        
        req.checkBody('lista', 'Campo deve ser uma lista').isArray();
        
        var erros = req.validationErrors();
        
        expect(erros).to.be(false);
        done();
      });
    });
    
    it('que deve gerar erros para campos não existentes', function (done) {
      delete req.body.lista;
      
      req.checkBody('lista', 'Campo deve ser uma lista').isArray();
      
      var erros = req.validationErrors();
      
      expect(erros).to.be.an('array');
      expect(erros).to.have.length(1);
      
      var erro = erros.shift();
      
      expect(erro).to.have.property('parametro').equal('lista');
      expect(erro).to.have.property('mensagem').equal('Campo deve ser uma lista');
      expect(erro).to.have.property('valor').equal(undefined);
      
      done();
    });
    
    it('que deve gerar erros para campos que não sejam do tipo lista', function (done) {
      req.body.lista = 'um valor qualquer';
      
      req.checkBody('lista', 'Campo deve ser uma lista').isArray();
      
      var erros = req.validationErrors();
      
      expect(erros).to.be.an('array');
      expect(erros).to.have.length(1);
      
      var erro = erros.shift();
      
      expect(erro).to.have.property('parametro').equal('lista');
      expect(erro).to.have.property('mensagem').equal('Campo deve ser uma lista');
      expect(erro).to.have.property('valor').equal('um valor qualquer');
      
      done();
    });
  });
});
