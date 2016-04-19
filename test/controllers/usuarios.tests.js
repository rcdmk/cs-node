'use strict';

var expect = require('expect.js');
var rewire = require('rewire');
var mongoose = require('mongoose');
var validator = require('../../middlewares/validacao')();

describe('Controller Usuários', function () {
	var controller, app, db, req, res, routerMock, usuariosServiceMock;
	
	before(function (done) {
		app = {
			use: function () {
			}
		};
		
		db = {
			model: function () {
			}
		};
		
		req = {
			params: {},
			query: {},
			body: {}
		};
		
		res = {
			status: function () {
				return res;
			},
			set: function () {
				return res
			},
			json: function () {
				return res;
			}
		};
		
		routerMock = {};
		
		var dadosUsuario = {
			id: 'abcdef1234567890abcdef01',
			nome: 'nome',
			email: 'email@teste.com',
			senha: 'senha',
			telefones: [
				{ ddd: '11', numero: '12345678' }
			]
		};

		usuariosServiceMock = {
			registrar: function (dados, cb) {
				cb(null, dadosUsuario);
			},
			obterPorId: function (dados, cb) {
				cb(null, dadosUsuario);
			}
		};
		
		delete mongoose.connection.models['Usuario']; // necessário para evitar erro com o rewire
		controller = rewire('../../controllers/usuarios');
		
		controller.__set__({
			express: {
				Router: function () {
					return routerMock;
				}
			},
			UsuariosService: function () {
				return usuariosServiceMock;
			}
		});
		
		// configurar validação
		validator(req, res, function () {
			done();
		});
	});
	
	beforeEach(function () {
		routerMock = {
			get: function () {
			},
			post: function () {
			}
		};
		
		req.body = {
			nome: 'nome',
			email: 'email@teste.com',
			senha: 'senha',
			telefones: [
				{ ddd: '11', numero: '12345678' }
			]
		};
		
		req._validationErrors = []; // zerar erros de validação para cada teste
	});
	
	
	it('deve retornar uma rota para cadastro de usuários em POST /usuarios', function (done) {
		routerMock.post = function (rota, cb) {
			expect(rota).to.be.equal('/');
			done();
		};
		
		controller(app, db);
	});
	
	
	it('deve retornar uma rota para consulta de usuários em GET /usuarios/:id_usuario', function (done) {
		routerMock.get = function (rota, cb) {
			expect(rota).to.be.equal('/:id_usuario');
			done();
		};
		
		controller(app, db);
	});
	
	describe('para a rota POST /usuarios', function () {
		beforeEach(function () {
			routerMock.post = function (rota, cb) {
				if (rota === '/') cb(req, res);
			};
		});
		
		describe('na Validação', function () {
			it('deve retornar erro se o email não for informado', function (done) {
				delete req.body.email;
				
				res.json = function (err) {
					expect(err).to.not.be(null);
					expect(err).to.have.property('erros');
					expect(err.erros).to.have.length(2);
					
					var erro = err.erros[0];
					expect(erro).to.have.property('parametro').equal('email');
					expect(erro).to.have.property('mensagem').equal('Informe um email');
					
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
					expect(err.erros).to.have.length(2);
					
					var erro = err.erros[0];
					expect(erro).to.have.property('parametro').equal('senha');
					expect(erro).to.have.property('mensagem').equal('Informe uma senha');
					
					erro = err.erros[1];
					expect(erro).to.have.property('parametro').equal('senha');
					expect(erro).to.have.property('mensagem').equal('A senha precisa ter de 4 a 10 caracteres');
					
					done();
				}
				
				controller(app, db);
			});
			
			it('deve retornar erro se a senha for menor que o esperado', function (done) {
				req.body.senha = '123';
				
				res.json = function (err) {
					expect(err).to.not.be(null);
					expect(err).to.have.property('erros');
					expect(err.erros).to.have.length(1);
					
					var erro = err.erros[0];
					expect(erro).to.have.property('parametro').equal('senha');
					expect(erro).to.have.property('mensagem').equal('A senha precisa ter de 4 a 10 caracteres');
					
					done();
				}
				
				controller(app, db);
			});
			
			it('deve retornar erro se a senha for maior que o esperado', function (done) {
				req.body.senha = '12345678901';
				
				res.json = function (err) {
					expect(err).to.not.be(null);
					expect(err).to.have.property('erros');
					expect(err.erros).to.have.length(1);
					
					var erro = err.erros[0];
					expect(erro).to.have.property('parametro').equal('senha');
					expect(erro).to.have.property('mensagem').equal('A senha precisa ter de 4 a 10 caracteres');
					
					done();
				}
				
				controller(app, db);
			});
		});
		
		
		describe('ao executar UsuariosService.registrar()', function () {
			it('deve retornar sucesso se todos os valores necessários forem informados corretamente', function (done) {
				var dadosEsperados = {
					id: 'abcdef1234567890abcdef01',
					nome: 'nome',
					email: 'email@teste.com',
					senha: 'senha',
					telefones: [
						{ ddd: '11', numero: '12345678' }
					]
				};
				
				res.status = function (status) {
					expect(status).to.be.equal(201);
					return res;
				};
				
				res.set = function (cabecalho, valor) {
					expect(cabecalho).to.be.equal('Location');
					expect(valor).to.be.equal('/usuarios/' + dadosEsperados.id);
					return res;
				};
				
				res.json = function (obj) {
					expect(obj).to.be.eql(dadosEsperados);
					done();
				};
				
				controller(app, db);
			});
			
			it('deve retornar erro 409 caso o serviço retorne erro E11000 - registro duplicado', function (done) {
				usuariosServiceMock.registrar = function (dados, cb) {
					cb(new Error('E11000 - ....'));
				};
				
				req.next = function (err) {
					expect(err).to.not.be(null);
					expect(err).to.have.property('status').equal(409);
					expect(err).to.have.property('message').equal('E-mail já existente');
					
					done();
				};
				
				controller(app, db);
			});
			
			it('deve retornar erro 503 caso ocorra erro no serviço', function (done) {
				usuariosServiceMock.registrar = function (dados, cb) {
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
	});
	

	describe('para a rota GET /usuarios/:id_usuario', function () {
		beforeEach(function () {
			routerMock.get = function (rota, cb) {
				if (rota === '/:id_usuario') cb(req, res);
			};

			req.params.id_usuario = 'abcdef1234567890abcdef01';

			res.status = function (status) {
				expect(status).to.be.equal(400);
				return res;
			};
		});
		
		describe('na Validação', function () {
			it('deve retornar erro se o id_usuario não tiver formato de ID do MongoDB válido', function (done) {
				req.params.id_usuario = 'abcdef12345640';
				
				res.json = function (err) {
					expect(err).to.not.be(null);
					expect(err).to.have.property('erros');
					expect(err.erros).to.have.length(1);
					
					var erro = err.erros[0];
					expect(erro).to.have.property('parametro').equal('id_usuario');
					expect(erro).to.have.property('mensagem').equal('ID de usuário inválido');
					
					done();
				}
				
				controller(app, db);
			});
		});
		
		
		describe('ao executar UsuariosService.obterPorId()', function () {
			it('deve retornar sucesso se todos os valores necessários forem informados corretamente', function (done) {
				var dadosEsperados = {
					id: 'abcdef1234567890abcdef01',
					nome: 'nome',
					email: 'email@teste.com',
					senha: 'senha',
					telefones: [
						{ ddd: '11', numero: '12345678' }
					]
				};
				
				res.status = function (status) {
					expect(status).to.be.equal(201);
					return res;
				};
				
				res.set = function (cabecalho, valor) {
					expect(cabecalho).to.be.equal('Location');
					expect(valor).to.be.equal('/usuarios/' + dadosEsperados.id);
					return res;
				};
				
				res.json = function (obj) {
					expect(obj).to.be.eql(dadosEsperados);
					done();
				};
				
				controller(app, db);
			});
			
			it('deve retornar erro 404 caso o serviço não retorne usuário', function (done) {
				usuariosServiceMock.obterPorId = function (dados, cb) {
					cb();
				};
				
				req.next = function (err) {
					expect(err).to.not.be(null);
					expect(err).to.have.property('status').equal(404);
					expect(err).to.have.property('message').equal('Recurso não encontrado');
					
					done();
				};
				
				controller(app, db);
			});
			
			it('deve retornar erro 503 caso ocorra erro no serviço', function (done) {
				usuariosServiceMock.obterPorId = function (dados, cb) {
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
	});
})
