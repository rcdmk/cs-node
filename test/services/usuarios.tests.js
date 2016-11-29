'use strict';

var expect = require('expect.js');
var sinon = require('sinon');


describe('Service Usuários', function() {
  var ServiceClass, service, model, query, dadosUsuario, id_usuario, listaUsuarios;
  var fakes, callback;

  before(function() {
    sinon.config = {
      useFakeTimers: false
    };

    ServiceClass = require('../../services/usuarios');
  });

  beforeEach(function() {
    fakes = sinon.sandbox.create();

    query = {
      nome: 'nome usuario',
      email: 'email@teste.com',
      senha: '1234',
      telefone: [{
        ddd: '11',
        numero: '12345678'
      }]
    };

    id_usuario = 'id_usuario_no_banco';

    dadosUsuario = {
      id: id_usuario,
      nome: 'nome usuario',
      email: 'email@teste.com',
      senha: '1234',
      telefone: [{
        ddd: '11',
        numero: '12345678'
      }],
      pegarJSON: function() {
        return JSON.stringify(this);
      }
    };

    listaUsuarios = [dadosUsuario];
    listaUsuarios.pegarJSON = function() {
      return JSON.stringify(this);
    };

    model = {
      find: function(cb) {
        setImmediate(function() {
          cb(null, listaUsuarios);
        });
      },
      create: function(usuario, cb) {
        setImmediate(function() {
          cb(null, dadosUsuario);
        });
      },
      findById: function(usuario, cb) {
        setImmediate(function() {
          cb(null, dadosUsuario);
        });
      }
    };

    service = new ServiceClass(model);

    callback = fakes.spy();
  });


  afterEach(function() {
    fakes.restore();
  });


  describe('ao executar registrar(usuario)', function() {
    it('deve montar a query para o model corretamente', function(done) {
      var queryEsperada = query;

      var create = fakes.spy(model, 'create');

      service.registrar(query, callback);

      setImmediate(function() {
        expect(create.callCount).to.be.equal(1);
        expect(create.calledWith(queryEsperada)).to.be.ok();
        done();
      });
    });


    it('deve retornar erro correto quando o model retornar erro', function(done) {
      var erroEsperado = new Error('ERRO!!!!');

      model.create = function(dados, cb) {
        cb(erroEsperado);
      };

      service.registrar(query, function(err) {
        expect(err).to.be.equal(erroEsperado);
        done();
      });
    });


    it('deve retornar os dados do usuário em caso de sucesso', function(done) {
      var retornoEsperado = {
        id: 'id_usuario_no_banco',
        nome: 'nome usuario',
        email: 'email@teste.com',
        senha: '1234',
        telefone: [{
          ddd: '11',
          numero: '12345678'
        }]
      };

      service.registrar(query, callback);

      setImmediate(function() {
        expect(callback.callCount).to.be.equal(1);

        var firstCall = callback.getCall(0);

        expect(firstCall.args).to.be.an('array');

        var callArgs = firstCall.args;

        expect(callArgs).to.have.length(2);
        expect(callArgs[0]).to.not.be.ok();
        expect(callArgs[1]).to.be.ok();

        var dados = JSON.parse(callArgs[1]);

        expect(dados).to.be.eql(retornoEsperado);
        done();
      });
    });
  });


  describe('ao executar obterTodos()', function() {
    it('deve chamar a lista do model', function() {
      var find = fakes.spy(model, 'find');

      service.obterTodos();

      expect(find.callCount).to.be.equal(1);

      find.restore();
    });


    it('deve retornar erro correto quando o model retornar erro', function() {
      var erroEsperado = new Error('ERRO!!!!');

      var stub = fakes.stub(model, 'find').yields(erroEsperado);
      var spyResponse = fakes.spy();

      service.obterTodos(spyResponse);

      expect(spyResponse.callCount).to.be.equal(1);
      expect(spyResponse.calledWithExactly(erroEsperado)).to.be.ok();
      stub.restore();
    });


    it('deve retornar sem erro e sem dados quando o model não retornar os dados do usuário', function() {
      var stub = fakes.stub(model, 'find').yields();
      var spyResponse = fakes.spy();

      service.obterTodos(spyResponse);

      expect(spyResponse.callCount).to.be.equal(1);
      expect(spyResponse.calledWithExactly(undefined)).to.be.ok();

      stub.restore();
    });


    it('deve retornar a lista de usuários em caso de sucesso', function(done) {
      var retornoEsperado = listaUsuarios.pegarJSON();

      var obterTodos = fakes.stub(service, 'obterTodos').yieldsAsync(null, listaUsuarios);

      service.obterTodos(callback);

      setImmediate(function() {
        expect(callback.callCount).to.be.equal(1);
        expect(callback.calledWithExactly(null, retornoEsperado));
        obterTodos.restore();
        done();
      });
    });
  });


  describe('ao executar obterPorId(id_usuario)', function() {
    it('deve montar a query para o model corretamente', function() {
      var findById = fakes.spy(model, 'findById');

      service.obterPorId(id_usuario);

      expect(findById.callCount).to.be.equal(1);
      expect(findById.calledWithExactly(id_usuario));
    });


    it('deve retornar erro correto quando o model retornar erro', function(done) {
      var erroEsperado = new Error('ERRO!!!!');

      var findById = fakes.stub(model, 'findById').yieldsAsync(erroEsperado);

      service.obterPorId(id_usuario, callback);

      setImmediate(function() {
        expect(callback.callCount).to.be.equal(1);
        expect(callback.calledWithExactly(erroEsperado)).to.be.ok();
        done();
      });
    });

    it('deve retornar sem erro e sem dados quando o model não retornar os dados do usuário', function(done) {
      model.findById = function(dados, cb) {
        cb();
      };

      service.obterPorId(id_usuario, function(err, dados) {
        expect(err).to.be(undefined);
        expect(dados).to.be(undefined);
        done();
      });
    });


    it('deve retornar os dados do usuário em caso de sucesso', function(done) {
      var retornoEsperado = {
        id: 'id_usuario_no_banco',
        nome: 'nome usuario',
        email: 'email@teste.com',
        senha: '1234',
        telefone: [{
          ddd: '11',
          numero: '12345678'
        }]
      };

      service.obterPorId(id_usuario, function(err, dados) {
        dados = JSON.parse(dados);

        expect(dados).to.have.property('id').equal(retornoEsperado.id);
        expect(dados).to.have.property('email').equal(retornoEsperado.email);
        expect(dados).to.have.property('senha').equal(retornoEsperado.senha);
        expect(dados).to.have.property('telefone').eql(retornoEsperado.telefone);

        done(err);
      });
    });
  });
});
