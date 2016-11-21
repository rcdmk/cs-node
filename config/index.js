'use strict';

/** Configurações disponíveis */
var configuracoes = {
  development: require('./DES.json'),
  production: require('./PRD.json'),
  test: require('./TEST.json')
};

/**
 * Retorna as configurações do ambiente informado
 * @param ambiente {String} O nome do ambiente para obter a configuração
 *	@remarks Caso não seja fornecido um ambiente ou seja fornecido um ambiente inválido, será assumido o ambiente de desenvolvimento (development)
 */
var Config = function Config(ambiente) {
  ambiente = ambiente || 'development';

  return configuracoes[ambiente] || configuracoes.development;
};

module.exports = Config;
