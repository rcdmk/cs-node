var env = process.env;

var configuracoes = {
    development: require('./DES.json'),
    production: require('./PRD.json')
};

var Config = function Config(ambiente) {
    this.ambiente = ambiente || 'development';
    
    return configuracoes[this.ambiente] || configuracoes.development;
};

module.exports = Config;