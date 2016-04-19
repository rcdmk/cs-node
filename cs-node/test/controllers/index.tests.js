'use strict';

var expect = require('expect.js');
var rewire = require('rewire');

describe('Módulo CarregarControllers', function () {
	var controllers, fsMock, appMock, controllerMock, requireOriginal;

	before(function () {
		requireOriginal = require;
		
		fsMock = {};
		
		appMock = {
			use: function () {
			}
		};

		controllerMock = function () {
		};
	});
	
	beforeEach(function () {
		controllers = rewire('../../controllers');

		controllers.__set__({
			fs: fsMock
		});
	});
	
	after(function () {
		require = requireOriginal;
	});
	

	it('deve carregar todos os arquivos da pasta controllers exceto index.js', function (done) {
		var numeroControllersEsperado = 2;
		var contollersEsperados = ['./controller1.js', './controller2.js'];
		var controllersCarregados = [];
		
		fsMock.readdir = function (caminho, cb) {
			cb(null, ['index.js', 'controller1.js', 'controller2.js']);
		};
		
		controllers.__set__( {
			require: function (arquivo) {
				controllersCarregados.push(arquivo);

				return controllerMock;
			}
		});
		
		controllers.carregarControllers(appMock, function (err) {
			expect(controllersCarregados).to.have.length(numeroControllersEsperado);
			expect(controllersCarregados).to.be.eql(contollersEsperados);
			
			done(err);
		});
	});

	it('deve retornar erro caso a leitura de diretório retorno um erro', function (done) {
		var erroEsperado = new Error('ERRO!');

		fsMock.readdir = function (caminho, cb) {
			cb(erroEsperado);
		};

		controllers.carregarControllers(appMock, function (err) {
			expect(err).to.be.equal(erroEsperado);
	
			done();
		});
	});
});
