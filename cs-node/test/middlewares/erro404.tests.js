'use strict';

var expect = require('expect.js');

describe('Middleware para erros 404 - Recurso não encontrado', function() {
	var middleware;

	before(function() {
		middleware = require('../../middlewares/erro404');
	});

	it('deve retornar o objeto de erro com os parâmetros corretos', function() {
		var erroEsperado = {
			status: 404,
			message: 'Recurso não encontrado'
		};

		middleware(null, null, function(err) {
			expect(err).to.be.eql(erroEsperado);
		});
	});
});
