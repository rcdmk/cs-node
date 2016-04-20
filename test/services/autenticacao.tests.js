'use strict';

var expect = require('expect.js');
var rewire = require('rewire');

describe('Service Autenticação', function () {
  var service, db, query, jwt, dadosUsuario;
  
  before(function () {
    db = function () { };
    
    db.prototype.codificarSenha = function () {
      return 'senhacodificada';
    };
    
    jwt = {};
    
    
    var serviceClass = rewire('../../services/autenticacao');
    
    serviceClass.__set__({
      config: {
        secret: 'segredoconfig',
        expiracao_token_minutos: 12
      },
      jwt: jwt
    });
    
    service = new serviceClass(db);
  });
  
  beforeEach(function () {
    query = {
      email: 'email@teste.com',
      senha: '1234'
    };
    
    dadosUsuario = {
      id: 'id_usuario_no_banco',
      email: 'email@teste.com',
      save: function (cb) {
        cb(null, dadosUsuario);
      },
      pegarJSON: function () {
        return JSON.stringify(dadosUsuario);
      }
    };
    
    db.findOne = function (query, cb) {
      cb(null, dadosUsuario);
    };
    
    jwt.sign = function (dados, segredo, opcoes, cb) {
      cb('tokencodificado');
    };
  });
  
  describe('ao executar autenticarUsuario()', function () {
    it('deve retornar erro caso não seja informado o e-mail', function (done) {
      delete query.email;
      
      service.autenticarUsuario(query, function (err) {
        expect(err).to.not.be(null);
        expect(err).to.have.property('name').equal('UsuarioOusenhaInvalidos');
        done();
      });
    });
    
    
    it('deve retornar erro caso não seja informada a senha', function (done) {
      delete query.senha;
      
      service.autenticarUsuario(query, function (err) {
        expect(err).to.not.be(null);
        expect(err).to.have.property('name').equal('UsuarioOusenhaInvalidos');
        done();
      });
    });
    
    
    it('deve montar a query para o model corretamente', function (done) {
      var queryEsperada = {
        email: 'email@teste.com',
        senha: 'senhacodificada'
      };
      
      db.findOne = function (dados) {
        expect(dados).to.be.eql(queryEsperada);
        done();
      };
      
      service.autenticarUsuario(query);
    });
    
    
    it('deve retornar erro correto quando o model retornar erro', function (done) {
      db.findOne = function (dados, cb) {
        cb(new Error('ERRO!!!!'));
      };
      
      service.autenticarUsuario(query, function (err) {
        expect(err).to.not.be(null);
        expect(err).to.have.property('name').equal('UsuarioOusenhaInvalidos');
        done();
      });
    });
    
    
    it('deve retornar erro correto quando o model não retornar os dados do usuário', function (done) {
      db.findOne = function (dados, cb) {
        cb();
      };
      
      service.autenticarUsuario(query, function (err) {
        expect(err).to.not.be(null);
        expect(err).to.have.property('name').equal('UsuarioOusenhaInvalidos');
        done();
      });
    });
    
    
    it('deve montar os dados para o JWT corretamente', function (done) {
      var dadosEsperados = {
        id: 'id_usuario_no_banco',
        email: 'email@teste.com'
      };
      
      jwt.sign = function (dados, segredo, opcoes) {
        expect(dados).to.be.eql(dadosEsperados);
        expect(segredo).to.be.eql('segredoconfig');
        expect(opcoes).to.have.property('expiresIn').equal(720); // 12 * 60
        done();
      };
      
      service.autenticarUsuario(query);
    });
    
    
    it('deve preencher o token e data do último login ao obter sucesso', function (done) {
      var agora = Date.now();
      
      dadosUsuario.save = function () {
        expect(this).to.have.property('token').equal('tokencodificado');
        expect(this).to.have.property('ultimo_login').within(agora - 100, agora);
        done();
      };
      
      service.autenticarUsuario(query);
    });
    
    
    it('deve retornar erro se der erro ao salvar os dados do usuário', function (done) {
      var erroEsperado = new Error('ERRO!!!');
      
      dadosUsuario.save = function (cb) {
        cb(erroEsperado);
      };
      
      service.autenticarUsuario(query, function (err) {
        expect(err).to.be.equal(erroEsperado);
        done();
      });
    });
    
    
    it('deve retornar os dados do usuário em caso de sucesso', function (done) {
      var retornoEsperado = {
        id: 'id_usuario_no_banco',
        email: 'email@teste.com',
        token: 'tokencodificado',
        ultimo_login: Date.now()
      };
      
      service.autenticarUsuario(query, function (err, dados) {
        dados = JSON.parse(dados);
        
        expect(dados).to.have.property('id').equal(retornoEsperado.id);
        expect(dados).to.have.property('email').equal(retornoEsperado.email);
        expect(dados).to.have.property('token').equal(retornoEsperado.token);
        expect(dados).to.have.property('ultimo_login').within(retornoEsperado.ultimo_login - 100, retornoEsperado.ultimo_login);
        done(err);
      });
    });
  });
});
