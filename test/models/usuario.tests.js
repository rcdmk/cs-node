'use strict';

var expect = require('expect.js');
var sinon = require('sinon');



describe('Modelo de usuário', function() {
  var model, modelInstance, fakes, utils, dataAtual, originalNow;

  before(function() {
    // Necessário modificar no espaço global para as propriedades
    // com valores padrão de data do esquema do modelo (mongoose)
    dataAtual = new Date('2016-01-01 00:00:00.000-02:00');
    originalNow = Date.now;

    Date.now = function() {
      return dataAtual;
    };

    model = require('../../models/usuario');
  });


  after(function() {
    Date.now = originalNow;
  });


  beforeEach(function() {
    fakes = sinon.sandbox.create();
    modelInstance = new model();
  });


  beforeEach(function() {
    fakes.restore();
  });


  describe('deve ter uma propriedade chamada nome', function() {
    it('do tipo texto', function() {
      expect(modelInstance).to.have.property('nome');
      expect(modelInstance.nome).to.be.a('string');
    });

    it('vazia por padrão', function() {
      expect(modelInstance.nome).to.be.equal('');
    });
  });


  describe('deve ter uma propriedade chamada email', function() {
    it('do tipo texto, vazio por padrão', function() {
      expect(modelInstance).to.have.property('email');
      expect(modelInstance.email).to.be.a('string');
    });

    it('vazia por padrão', function() {
      expect(modelInstance.email).to.be.equal('');
    });
  });


  describe('deve ter uma propriedade chamada senha', function() {
    it('do tipo texto', function() {
      expect(modelInstance).to.have.property('senha');
      expect(modelInstance.senha).to.be.a('string');
    });

    it('vazia por padrão', function() {
      expect(modelInstance.senha).to.be.equal('');
    });
  });


  describe('deve ter uma propriedade chamada telefones', function() {
    it('do tipo lista de telefones', function() {
      expect(modelInstance).to.have.property('telefones');
      expect(modelInstance.telefones).to.be.an(Array);
    });

    it('vazia por padrão', function() {
      expect(modelInstance.telefones).to.be.empty();
    });
  });


  describe('deve ter uma propriedade data_criacao', function() {
    it('do tipo data e hora', function() {
      expect(modelInstance).to.have.property('data_criacao');
      expect(modelInstance.data_criacao).to.be.a(Date);
    });

    it('com data e hora atual por padrão', function() {
      expect(modelInstance.data_criacao).to.be.eql(dataAtual);
    });
  });
});
