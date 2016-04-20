'use strict';

var utils = require('../utils');

/**
 * Gerenciador de erros 404 - Não encontrado
 * @param req {Object} O objeto com a definição da requisição
 * @param res {Object} O objeto com a definição da resposta
 * @param next {Function} A callback para o sistema de middlewares
 */
var Erro404 = function erro404(req, res, next) {
  utils.retornarErro404(next);
};

module.exports = Erro404;
