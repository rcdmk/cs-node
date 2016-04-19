'use strict';

var jwt = require('jsonwebtoken');

var config = require('../config')(process.env.NODE_ENV);


/**
 * Serviço para autenticação de usuários
 * @param model {Object} Uma instância de de um modelo para banco de dados
 */
var AutenticacaoService = function AutenticacaoService(model) {
    this.db = model;
};

/**
 * Autentica um usuário
 * @param dados {Object} Um objeto com os dados do usuário para registrar
 *  @option email {String} O e-mail do usuário
 *  @option senha {String} A senha do usuário
 * @param cb {Function} Uma função para receber o retorno da execução
 *	@option err {Object} Um objeto de erro
 *	@option dados {Object} Um objeto com os dados do usuário autenticado
 */
AutenticacaoService.prototype.autenticarUsuario = function AutenticarUsuario(dados, cb) {
    if (!dados.email || !dados.senha) {
		var erro = new Error('Usuário e/ou senha inválidos');
		erro.name = 'UsuarioOusenhaInvalidos';
		
		return cb(erro);
    }

    this.db.findOne({ email: dados.email, senha: this.db.prototype.codificarSenha(dados.senha) }, function (err, usuario) {
        if (err || !usuario) {
            var erro = new Error('Usuário e/ou senha inválidos');
            erro.name = 'UsuarioOusenhaInvalidos';

            return cb(erro);
        } else {			
			var token = jwt.sign({
				id: usuario.id,
				email: usuario.email
			}, config.secret, {
				expiresInMinutes: config.expiracao_token_minutos
			}, function jwtSign(token) {
				usuario.token = token;
				usuario.ultimo_login = Date.now();
				
				usuario.save(function (err, dados) {
					if (err) {
						return cb(err);
					}
					
					cb(null, usuario.pegarJSON());
				});
			});
        }
    });
};


module.exports = AutenticacaoService;