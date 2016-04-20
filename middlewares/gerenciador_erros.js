'use strict';

var debug = require('debug')('cs-node: ' + process.pid);

/**
 * Gerenciador de erros padrão
 * @param err {Object} Um objeto de erro
 * @param req {Object} O objeto com a definição da requisição
 * @param res {Object} O objeto com a definição da resposta
 * @param next {Function} A callback para o sistema de middlewares
 */
var GerenciadorDeErros = function gerenciadorDeErros(err, req, res, next) {
  debug(err);
  
  // erro na autorização via token
  if (err.name === 'UnauthorizedError') {
    err = {
      status: 401,
      message: err.message === 'jwt expired' ? 'Sessão inválida' : 'Não autorizado',
      err: err
    };
  }
  
  res.status(err.status || 500);
  
  var resposta = {
    mensagem: err.message || 'Erro interno do servidor'
  };
  
  if (req.config.ambiente == 'desenvolvimento') {
    resposta.req = {
      headers: req.headers,
      params: req.params,
      query: req.query,
      body: req.body
    };
    
    resposta.erro = err.stack || (err.err && err.err.stack) || err.err;
  }
  
  res.json(resposta);
};

module.exports = GerenciadorDeErros;