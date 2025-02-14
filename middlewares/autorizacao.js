'use strict';

var jwt = require('express-jwt');

/**
 * Configura a aplicação, definindo as regras de autorização de acesso
 * @param app {Object} A aplicação Express
 */
var ConfigurarAutorizacao = function configurarAutorizacao(app) {
  var appConfig = app.get('config');

  if (!appConfig) {
  	throw new Error('É necessário configurar a aplicação antes de executar este módulo!');
  }

  var jwtMiddleware = jwt.expressjwt({ secret: appConfig.secret, algorithms: ['HS256'] });

  // proteger rotas GET
	app.get([
			'/usuarios',
			'/usuarios/',
			'/usuarios/:id_usuario',
			'/usuarios/:id_usuario/'
		], jwtMiddleware);
};

module.exports = ConfigurarAutorizacao;
