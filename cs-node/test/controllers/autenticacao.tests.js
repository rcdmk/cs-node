'use strict';

var expect = require('expect.js');
var rewire = require('rewire');
var mongoose = require('mongoose');
var validator = require('../../middlewares/validacao')();

describe('Controller Autenticação', function () {
	var controller, app, db, req, res, routerMock, autenticacaoServiceMock;
	
	before(function (done) {
		app = {
			use: function () {
			}
		};
		
		db = {
			model: function () {
			}
		};
		
		req = {};
		
		res = {
			status: function () {
				return res;
			},
			json: function () {
				return res;
			}
		};
		
		routerMock = {
			post: function () {
			}
		};
		
		autenticacaoServiceMock = {
			autenticarUsuario: function (dados, cb) {
				cb(null, dados);
			}
		};
		
		delete mongoose.connection.models['Usuario']; // necessário para evitar erro com o rewire
		controller = rewire('../../controllers/autenticacao');
		
		controller.__set__({
			express: {
				Router: function () {
					return routerMock;
				}
			},
			AutenticacaoService: function () {
				return autenticacaoServiceMock;
			}
		});
		
		// configurar validação
		validator(req, res, function () {
			done();
		});
	});
	
	beforeEach(function () {
		req.body = {
			email: 'email@teste.com',
			senha: 'senha'
		};

		req._validationErrors = []; // zerar erros de validação para cada teste
	});
	
	
	it('deve retornar uma rota para autenticação em POST /autenticacao', function (done) {
		routerMock.post = function (rota, cb) {
			expect(rota).to.be.equal('/');
			done();
		};
		
		controller(app, db);
	});
	
	
	describe('Validação', function () {
		beforeEach(function () {
			routerMock.post = function (rota, cb) {
				cb(req, res);
			};
		});
		
		it('deve retornar erro se o email não for informado', function (done) {
			delete req.body.email;
			
			res.json = function (err) {
				expect(err).to.not.be(null);
				expect(err).to.have.property('erros');
				expect(err.erros).to.have.length(2);
				
				var erro = err.erros[0];
				expect(erro).to.have.property('parametro').equal('email');
				expect(erro).to.have.property('mensagem').equal('Informe o email');
				
				erro = err.erros[1];
				expect(erro).to.have.property('parametro').equal('email');
				expect(erro).to.have.property('mensagem').equal('E-mail inválido');
				
				done();
			}
			
			controller(app, db);
		});
		
		it('deve retornar erro se o email for inválido', function (done) {
			req.body.email = 'emailinvalido@teste';
			
			res.json = function (err) {
				expect(err).to.not.be(null);
				expect(err).to.have.property('erros');
				expect(err.erros).to.have.length(1);
				
				var erro = err.erros[0];
				expect(erro).to.have.property('parametro').equal('email');
				expect(erro).to.have.property('mensagem').equal('E-mail inválido');
				
				done();
			}
			
			controller(app, db);
		});
		
		it('deve retornar erro se a senha não for informada', function (done) {
			delete req.body.senha;
			
			res.json = function (err) {
				expect(err).to.not.be(null);
				expect(err).to.have.property('erros');
				expect(err.erros).to.have.length(1);
				
				var erro = err.erros[0];
				expect(erro).to.have.property('parametro').equal('senha');
				expect(erro).to.have.property('mensagem').equal('Informe a senha');
				
				done();
			}
			
			controller(app, db);
		});
	});


	describe('AutenticacaoService', function () {		
		it('deve retornar sucesso se todos os valores necessários forem informados corretamente', function (done) {
			var dadosEsperados = {
				email: 'email@teste.com',
				senha: 'senha'
			};
			
			res.json = function (obj) {
				expect(obj).to.be.eql(dadosEsperados);
				done();
			};
			
			controller(app, db);
		});

		it('deve retornar erro 401 caso o serviço retorne erro UsuarioOusenhaInvalidos', function (done) {
			autenticacaoServiceMock.autenticarUsuario = function (dados, cb) {
				cb({
					name: 'UsuarioOusenhaInvalidos',
					message: 'Usuário ou senha inválidos.'
				});
			};
			
			req.next = function (err) {
				expect(err).to.not.be(null);
				expect(err).to.have.property('status').equal(401);
				expect(err).to.have.property('message').equal('Usuário ou senha inválidos.');
				
				done();
			};
			
			controller(app, db);
		});

		it('deve retornar erro 503 caso ocorra erro no serviço', function (done) {
			autenticacaoServiceMock.autenticarUsuario = function (dados, cb) {
				cb(new Error('ERRO!!!'));
			};
			
			req.next = function (err) {
				expect(err).to.not.be(null);
				expect(err).to.have.property('status').equal(503);
				expect(err).to.have.property('message').equal('Serviço temporariamente indisponível');
				
				done();
			};
			
			controller(app, db);
		});
	});
})
