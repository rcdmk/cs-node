var env = process.env;

var configuracoes = {
    development: require('./DES.json'),
    production: require('./PRD.json')
};

/**
 * Retorna as configurações do ambiente informado
 * @param ambiente {String} O nome do ambiente para obter a configuração
 *	@remarks Caso não seja fornecido um ambiente ou seja fornecido um ambiente inválido, será assumido o ambiente de desenvolvimento (development)
 */
var Config = function Config(ambiente) {
    this.ambiente = ambiente || 'development';
    
    return configuracoes[this.ambiente] || configuracoes.development;
};

module.exports = Config;