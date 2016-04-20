'use strict';

var expect = require('expect.js');

describe('Service Usuários', function () {
  var service, db, query, dadosUsuario, id_usuario;
  
  before(function () {
    db = function () { };
    
    var serviceClass = require('../../services/usuarios');
    
    service = new serviceClass(db);
  });
  
  beforeEach(function () {
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
      pegarJSON: function () {
        return JSON.stringify(dadosUsuario);
      }
    };
    
    db.create = function (usuario, cb) {
      cb(null, dadosUsuario);
    };
    
    db.findById = function (usuario, cb) {
      cb(null, dadosUsuario);
    };
  });
  
  
  describe('ao executar registrar()', function () {
    it('deve montar a query para o model corretamente', function (done) {
      var queryEsperada = query;
      
      db.create = function (dados) {
        expect(dados).to.be.eql(queryEsperada);
        done();
      };
      
      service.registrar(query);
    });
    
    
    it('deve retornar erro correto quando o model retornar erro', function (done) {
      var erroEsperado = new Error('ERRO!!!!');
      
      db.create = function (dados, cb) {
        cb(erroEsperado);
      };
      
      service.registrar(query, function (err) {
        expect(err).to.be.equal(erroEsperado);
        done();
      });
    });
    
    
    it('deve retornar os dados do usuário em caso de sucesso', function (done) {
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
      
      service.registrar(query, function (err, dados) {
        dados = JSON.parse(dados);
        
        expect(dados).to.have.property('id').equal(retornoEsperado.id);
        expect(dados).to.have.property('email').equal(retornoEsperado.email);
        expect(dados).to.have.property('senha').equal(retornoEsperado.senha);
        expect(dados).to.have.property('telefone').eql(retornoEsperado.telefone);
        
        done(err);
      });
    });
  });
  
  
  describe('ao executar obterPorId()', function () {
    it('deve montar a query para o model corretamente', function (done) {
      db.findById = function (dados) {
        expect(dados).to.be.eql(id_usuario);
        done();
      };
      
      service.obterPorId(id_usuario);
    });
    
    
    it('deve retornar erro correto quando o model retornar erro', function (done) {
      var erroEsperado = new Error('ERRO!!!!');
      
      db.findById = function (dados, cb) {
        cb(erroEsperado);
      };
      
      service.obterPorId(id_usuario, function (err) {
        expect(err).to.be.equal(erroEsperado);
        done();
      });
    });
    
    it('deve retornar sem erro e sem dados quando o model não retornar os dados do usuário', function (done) {
      db.findById = function (dados, cb) {
        cb();
      };
      
      service.obterPorId(id_usuario, function (err, dados) {
        expect(err).to.be(undefined);
        expect(dados).to.be(undefined);
        done();
      });
    });
    
    
    it('deve retornar os dados do usuário em caso de sucesso', function (done) {
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
      
      service.obterPorId(id_usuario, function (err, dados) {
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
