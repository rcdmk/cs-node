'use strict';

var validator = require('express-validator');

/**
 * Configurações da validação de entrada padrão
 * @returns validator {Function} Uma referência para o middleware de validação do express-validator
 */
var validacaoEntrada = function validacaoEntrada() {
  return validator({
    errorFormatter: function (param, msg, value) {
      return {
        parametro: param,
        mensagem: msg,
        valor: value
      };
    },
    customValidators: {
      isArray: function (value) {
        return Array.isArray(value);
      }
    }
  });
};

module.exports = validacaoEntrada;