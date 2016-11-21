'use strict';

var obterConfig = require('../config');

/**
 * Configura a aplicação, carregando opções do arquivo de configuração para o ambiente
 * @param app {Object} A aplicação Express
 */
var ConfigurarApp = function configurarApp(app, env) {
	var config = obterConfig(env);

  app.set('port', config.porta || process.env.PORT || 3000);
  app.set('secret', config.secret);
  app.set('config', config);

	/**
	 * Injetor de configuraões no request
	 * @param req {Object} O objeto com a definição da requisição
	 * @param res {Object} O objeto com a definição da resposta
	 * @param next {Function} A callback para o sistema de middlewares
	 */
  function injetarConfig(req, res, next) {
    req.config = config;

    next();
  };

  app.use(injetarConfig);

  return injetarConfig;
};

module.exports = ConfigurarApp;
