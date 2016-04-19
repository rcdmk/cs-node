'use strict';

var express = require('express');
var utils = require('../utils');

var AutenticacaoService = require('../services/autenticacao');
var UsuarioModel = require('../models/usuario');


/**
 * Controller de autenticação de acesso
 * @param app {Object} Uma instância de aplicação Express
 * @param db {Object} Uma instância do mongoose
 * @returns {Function} Um middleware para responder pelas rotas definidas
 */
var AutenticacaoController = function AutenticacaoController(app, db) {
	UsuarioModel = db.model('Usuario');
	
	var service = new AutenticacaoService(UsuarioModel);	
	
	var router = express.Router();
	
	// POST /autenticacao
	router.post('/', function (req, res) {
		// validação de entrada
		req.checkBody('email', 'Informe o email').notEmpty().isEmail().withMessage('E-mail inválido');
		req.checkBody('senha', 'Informe a senha').notEmpty();
		
		var erros = req.validationErrors();
		
		if (erros) {
			utils.formatarErrosValidacao(res, erros);
		} else {
			var dados = {
				email: req.body.email,
				senha: req.body.senha
			};
			
			service.autenticarUsuario(dados, function (err, data) {
				if (err) {
					if (err.name === 'UsuarioOusenhaInvalidos') {
						err.status = 401;
						req.next(err);
					} else {
						utils.retornarErro503(err, req.next);
					}
				} else {
					res.json(data);
				}
			});
		}
	});

	return router;
}

module.exports = AutenticacaoController;