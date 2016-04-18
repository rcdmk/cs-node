'use strict';

var express = require('express');
var mongoose = require('mongoose');

var utils = require('../utils');
var AutenticacaoService = require('../services/autenticacao');
var UsuarioModel = require('../models/usuario');

var router = express.Router();
var service = new AutenticacaoService(UsuarioModel);


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

module.exports = router;