'use strict';

/**
 * Monta a resposta padrão para erros de validação
 * @param res {Object} O objeto de resposta
 * @param erros {Array} A lista de erros de validação
 */
var formatarErrosValidacao = function formatarErrosValidacao(res, erros) {
    return res.status(400).json({
        message: 'Alguns dados enviados são inválidos.',
        erros: erros
    });
};


/**
 * Monta um erro 404 padão
 * @param next {Function} A callback do middleware do express
 */
var retornarErro404 = function formatarErro404(next) {
    var err = {
        message: 'Recurso não encontrado',
        status: 404
    };
    
    next(err);
};


/**
 * Monta um erro 503 padrão
 * @param err {Object} Um objeto de erro
 * @param next {Function} A callback do middleware do express
*/
var retornarErro503 = function formatarErro503(err, next) {
    var err = {
        message: 'Serviço temporariamente indisponível',
        status: 503,
        err: err
    };
    
    next(err);
};

module.exports = {
    formatarErrosValidacao: formatarErrosValidacao,
    retornarErro404: retornarErro404,
    retornarErro503: retornarErro503
};