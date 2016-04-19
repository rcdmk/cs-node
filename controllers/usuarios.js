'use strict';

var express = require('express');
var utils = require('../utils/');

var UsuarioModel = require('../models/usuario');
var UsuariosService = require('../services/usuarios');

/**
 * Controller de acesso e manutenção de cadastros de usuários
 * @param app {Object} Uma instância de aplicação Express
 * @param db {Object} Uma instância do mongoose
 * @returns {Function} Um middleware para responder pelas rotas definidas
 */
var UsuariosController = function UsuariosController(app, db) {
	UsuarioModel = db.model('Usuario');
	
	var router = express.Router();
	var service = new UsuariosService(UsuarioModel);
	
	// POST /usuarios
	router.post('/', function (req, res) {
		// validação de entrada
		req.checkBody('nome', 'Informe um nome').notEmpty();
		req.checkBody('email', 'Informe um email').notEmpty().isEmail().withMessage('E-mail inválido');
		req.checkBody('senha', 'Informe uma senha').notEmpty().isLength(4, 10).withMessage('A senha precisa ter de 4 a 10 caracteres');
		req.checkBody('telefones', 'Informe uma lista de telefones').optional().isArray();
		req.checkBody('telefones.ddd', 'DDD precisa ter 2 caracteres numéricos').optional().isNumeric().isLength(2, 2);
		req.checkBody('telefones.numero', 'Número de telefone precisa ter entre 8 e 9 caracteres numéricos').optional().isNumeric().isLength(8, 9);
		
		var erros = req.validationErrors();
		
		if (erros) {
			utils.formatarErrosValidacao(res, erros);
		} else {
			var telefones = [];
			
			if (Array.isArray(req.body.telefones)) {
				telefones = req.body.telefones.map(function (telefone) {
					return {
						ddd: telefone.ddd.toString().trim(),
						numero: telefone.numero.toString().trim()
					};
				});
			}
			
			var usuario = {
				nome: req.body.nome.toString().trim(),
				email: req.body.email.trim(),
				senha: req.body.senha.toString().trim(),
				telefones: telefones
			};
			
			service.registrar(usuario, function (err, data) {
				if (err) {
					if (err.message && err.message.indexOf('E11000') === 0) {
						req.next({
							message: 'E-mail já existente',
							status: 409
						});
					} else {
						utils.retornarErro503(err, req.next);
					}
				} else {
					res.status(201)
                    .set('Location', '/usuarios/' + data.id)
                    .json(data);
				}
			});
		}
	});
	
	
	// GET /usuarios/:id_usuario
	router.get('/:id_usuario', function (req, res) {
		// validação de entrada
		req.checkParams('id_usuario', 'ID de usuário inválido').matches(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i);
		
		var erros = req.validationErrors();
		
		if (erros) {
			utils.formatarErrosValidacao(res, erros);
		} else {
			service.obterPorId(req.params.id_usuario, function (err, data) {
				if (err) {
					utils.retornarErro503(err, req.next);
				} else if (!data) {
					utils.retornarErro404(req.next);
				} else {
					res.json(data);
				}
			});
		}
	});

	return router;
}	

module.exports = UsuariosController;