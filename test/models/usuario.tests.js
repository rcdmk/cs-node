'use strict';

var expect = require('expect.js');
var sinon = require('sinon');



describe('Modelo de usuário', function() {
  var Model, modelInstance, fakes, dataAtual, originalNow;
  var callback, dadosUsuario;

  before(function() {
    // Necessário modificar no espaço global para as propriedades
    // com valores padrão de data do esquema do modelo (mongoose)
    dataAtual = new Date('2016-01-01 00:00:00.000-02:00');
    originalNow = Date.now;

    Date.now = function() {
      return dataAtual;
    };

    Model = require('../../models/usuario');
  });


  after(function() {
    Date.now = originalNow;
  });


  beforeEach(function() {
    fakes = sinon.sandbox.create();
    callback = fakes.spy();

    dadosUsuario = {
      nome: 'nome',
      email: 'email@teste.com',
      senha: 'senha',
      telefones: [{
        ddd: '11',
        numero: '123456678'
      }, {
        ddd: '12',
        numero: '987654321'
      }]
    };

    modelInstance = new Model(dadosUsuario);
  });


  beforeEach(function() {
    fakes.restore();
  });


  function obterErrosDeValidacao(erro) {
    expect(erro).to.be.an(Error);
    return erro.errors;
  }


  describe('deve ter uma propriedade chamada nome', function() {
    it('do tipo texto', function() {
      expect(modelInstance).to.have.property('nome');
      expect(modelInstance.nome).to.be.a('string');
    });

    it('vazia por padrão', function() {
      delete dadosUsuario.nome;

      modelInstance = new Model(dadosUsuario);

      expect(modelInstance.nome).to.be.equal('');
    });

    it('com valor definido na criação do objeto', function() {
      var nomeEsperado = 'NOME ESPERADO';

      modelInstance = new Model({
        nome: nomeEsperado
      });

      expect(modelInstance.nome).to.be.equal(nomeEsperado);
    });

    it('que pode ser nula ao salvar', function(done) {
      delete dadosUsuario.nome;

      modelInstance = new Model(dadosUsuario);

      modelInstance.validate(callback);

      setImmediate(function() {
        expect(callback.callCount).to.be.equal(1);
        expect(callback.firstCall.args).to.have.length(1);
        expect(callback.firstCall.args[0]).to.be(null);
        done();
      });
    });

    it('que pode ser vazia ao salvar', function(done) {
      dadosUsuario.nome = '';

      modelInstance = new Model(dadosUsuario);

      modelInstance.validate(callback);

      setImmediate(function() {
        expect(callback.callCount).to.be.equal(1);
        expect(callback.firstCall.args).to.have.length(1);
        expect(callback.firstCall.args[0]).to.be(null);
        done();
      });
    });
  });


  describe('deve ter uma propriedade chamada email', function() {
    it('do tipo texto, vazio por padrão', function() {
      expect(modelInstance).to.have.property('email');
      expect(modelInstance.email).to.be.a('string');
    });

    it('vazia por padrão', function() {
      delete dadosUsuario.email;

      modelInstance = new Model(dadosUsuario);

      expect(modelInstance.email).to.be.equal('');
    });

    it('que não pode ser nula ao salvar', function(done) {
      delete dadosUsuario.email;

      modelInstance = new Model(dadosUsuario);

      modelInstance.validate(callback);

      setImmediate(function() {
        expect(callback.callCount).to.be.equal(1);
        expect(callback.firstCall.args).to.have.length(1);

        var erros = obterErrosDeValidacao(callback.firstCall.args[0]);

        expect(erros).to.have.property('email');
        expect(erros.email).to.have.property('message').equal('Path `email` is required.');

        done();
      });
    });

    it('que não pode ser vazia ao salvar', function(done) {
      dadosUsuario.email = '';

      modelInstance = new Model(dadosUsuario);

      modelInstance.validate(callback);

      setImmediate(function() {
        expect(callback.callCount).to.be.equal(1);
        expect(callback.firstCall.args).to.have.length(1);

        var erros = obterErrosDeValidacao(callback.firstCall.args[0]);

        expect(erros).to.have.property('email');
        expect(erros.email).to.have.property('message').equal('Path `email` is required.');

        done();
      });
    });
  });


  describe('deve ter uma propriedade chamada senha', function() {
    it('do tipo texto', function() {
      expect(modelInstance).to.have.property('senha');
      expect(modelInstance.senha).to.be.a('string');
    });

    it('vazia por padrão', function() {
      delete dadosUsuario.senha;

      modelInstance = new Model(dadosUsuario);

      expect(modelInstance.senha).to.be.equal('');
    });

    it('que não pode ser nula ao salvar', function(done) {
      delete dadosUsuario.senha;

      modelInstance = new Model(dadosUsuario);

      modelInstance.validate(callback);

      setImmediate(function() {
        expect(callback.callCount).to.be.equal(1);
        expect(callback.firstCall.args).to.have.length(1);

        var erros = obterErrosDeValidacao(callback.firstCall.args[0]);

        expect(erros).to.have.property('senha');
        expect(erros.senha).to.have.property('message').equal('Path `senha` is required.');

        done();
      });
    });

    it('que não pode ser vazia ao salvar', function(done) {
      dadosUsuario.senha = '';

      modelInstance = new Model(dadosUsuario);

      modelInstance.validate(callback);

      setImmediate(function() {
        expect(callback.callCount).to.be.equal(1);
        expect(callback.firstCall.args).to.have.length(1);

        var erros = obterErrosDeValidacao(callback.firstCall.args[0]);

        expect(erros).to.have.property('senha');
        expect(erros.senha).to.have.property('message').equal('Path `senha` is required.');

        done();
      });
    });

    it('que deve ser criptografada ao salvar', function(done) {
      var senhaCodificada = 'abcd123456';

      var codificarSenha = fakes.stub(modelInstance, 'codificarSenha').returns(senhaCodificada);

      modelInstance.save(callback);

      setImmediate(function() {
        expect(codificarSenha.callCount).to.be.equal(1);
        expect(modelInstance.senha).to.be.equal(senhaCodificada);
        done();
      });
    });
  });


  describe('deve ter uma propriedade chamada telefones', function() {
    it('do tipo lista de telefones', function() {
      expect(modelInstance).to.have.property('telefones');
      expect(modelInstance.telefones).to.be.an(Array);
    });

    it('vazia por padrão', function() {
      delete dadosUsuario.telefones;

      modelInstance = new Model(dadosUsuario);

      expect(modelInstance.telefones).to.be.empty();
    });

    it('que pode ser nula ao salvar', function(done) {
      delete dadosUsuario.telefones;

      modelInstance = new Model(dadosUsuario);

      modelInstance.validate(callback);

      setImmediate(function() {
        expect(callback.callCount).to.be.equal(1);
        expect(callback.firstCall.args).to.have.length(1);
        expect(callback.firstCall.args[0]).to.be(null);
        done();
      });
    });

    it('que pode ser vazia ao salvar', function(done) {
      dadosUsuario.telefones = [];

      modelInstance = new Model(dadosUsuario);

      modelInstance.validate(callback);

      setImmediate(function() {
        expect(callback.callCount).to.be.equal(1);
        expect(callback.firstCall.args).to.have.length(1);
        expect(callback.firstCall.args[0]).to.be(null);
        done();
      });
    });

    describe('com telefones', function() {
      it('que devem ter uma propriedade ddd preenchida', function(done) {
        var telefone = dadosUsuario.telefones[0];

        telefone.ddd = '';

        dadosUsuario.telefones = [telefone];

        modelInstance = new Model(dadosUsuario);

        modelInstance.validate(callback);

        setImmediate(function() {
          expect(callback.callCount).to.be.equal(1);
          expect(callback.firstCall.args).to.have.length(1);

          var erros = obterErrosDeValidacao(callback.firstCall.args[0]);

          expect(erros).to.have.property('telefones.0.ddd');
          expect(erros['telefones.0.ddd']).to.have.property('message').equal('Path `ddd` is required.');

          done();
        });
      });

      it('que devem ter uma propriedade numero preenchida', function(done) {
        var telefone = dadosUsuario.telefones[0];

        telefone.numero = '';

        dadosUsuario.telefones = [telefone];

        modelInstance = new Model(dadosUsuario);

        modelInstance.validate(callback);

        setImmediate(function() {
          expect(callback.callCount).to.be.equal(1);
          expect(callback.firstCall.args).to.have.length(1);

          var erros = obterErrosDeValidacao(callback.firstCall.args[0]);

          expect(erros).to.have.property('telefones.0.numero');
          expect(erros['telefones.0.numero']).to.have.property('message').equal('Path `numero` is required.');

          done();
        });
      });
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


  describe('deve ter uma propriedade data_atualizacao', function() {
    it('do tipo data e hora', function() {
      expect(modelInstance).to.have.property('data_atualizacao');
      expect(modelInstance.data_atualizacao).to.be.a(Date);
    });

    it('com data e hora atual por padrão', function() {
      expect(modelInstance.data_atualizacao).to.be.eql(dataAtual);
    });

    it('deve atualizar para a data da atualização ao salvar', function(done) {
      dataAtual = dataAtual.setTime(dataAtual.getTime() + 1000);

      modelInstance.save(callback);

      setImmediate(function() {
        expect(modelInstance.data_atualizacao).to.be.eql(dataAtual);
        done();
      });
    });
  });
});
