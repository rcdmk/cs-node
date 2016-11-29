'use strict';

/**
 * Serviço para registro e busca de dados de usuários
 * @param model {Object} Uma instância de de um modelo para banco de dados
 */
var UsuariosService = function UsuariosService(model) {
  this.db = model;
};

/**
 * Registra um usuário
 * @param usuario {Object} Um objeto com os dados do usuário para registrar
 * @see /models/usuario.js
 */
UsuariosService.prototype.registrar = function RegistrarUsuario(usuario, cb) {
  this.db.create(usuario, function(err, dados) {
    if (err) {
      return cb(err);
    }

    cb(null, dados.pegarJSON());
  });
};

/**
 * Obtém a lista de todos os usuários
 * @param usuario {Object} Um objeto com os dados do usuário para registrar
 * @see /models/usuario.js
 */
UsuariosService.prototype.obterTodos = function ObterTodosUsuarios(cb) {
  this.db.find(function(err, dados) {
    if (err || !dados) {
      return cb(err);
    }

    cb(null, dados.pegarJSON());
  });
};

/**
 * Obtém os dados de um usuário pelo seu ID
 * @param idUsuario {String} O ID do usuário para obter
 */
UsuariosService.prototype.obterPorId = function ObterUsuario(idUsuario, cb) {
  this.db.findById(idUsuario, function(err, dados) {
    if (err || !dados) {
      return cb(err);
    }

    cb(null, dados.pegarJSON());
  });
};


module.exports = UsuariosService;
