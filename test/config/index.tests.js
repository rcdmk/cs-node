'use strict';

var expect = require('expect.js');

describe('Módulo Config', function () {
	var config;

	before(function () {
		config = require('../../config/');
	});

	it('deve retornar a configuração para o ambiente de desenvolvimento', function () {
		var ambienteEsperado = 'desenvolvimento';

		var configuracao = config('development');

		expect(configuracao.ambiente).to.be.equal(ambienteEsperado);
	});

	it('deve retornar a configuração para o ambiente de produção', function () {
		var ambienteEsperado = 'produção';
		
		var configuracao = config('production');
		
		expect(configuracao.ambiente).to.be.equal(ambienteEsperado);
	});

	it('deve retornar a configuração para desenvolvimento quando não for informado ambiente', function () {
		var ambienteEsperado = 'desenvolvimento';
		
		var configuracao = config();
		
		expect(configuracao.ambiente).to.be.equal(ambienteEsperado);
	});

	it('deve retornar a configuração para desenvolvimento quando for informado um ambiente inválido', function () {
		var ambienteEsperado = 'desenvolvimento';
		
		var configuracao = config('qualquer');
		
		expect(configuracao.ambiente).to.be.equal(ambienteEsperado);
	});
});