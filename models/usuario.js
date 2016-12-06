'use strict';

var mongoose = require('mongoose');
var crypto = require('crypto');

var TelefoneUsuario = new mongoose.Schema({
  ddd: {
    type: String,
    required: true,
    default: ''
  },
  numero: {
    type: String,
    required: true,
    default: ''
  }
}, {
  _id: false
});


var Usuario = new mongoose.Schema({
  nome: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true,
    default: '',
    index: {
      unique: true
    }
  },
  senha: {
    type: String,
    required: true,
    default: ''
  },
  telefones: [TelefoneUsuario],
  data_criacao: {
    type: Date,
    required: true,
    default: () => Date.now()
  },
  data_atualizacao: {
    type: Date,
    required: true,
    default: Date.now
  },
  ultimo_login: {
    type: Date
  },
  token: {
    type: String
  }
});


Usuario.set('toObject', {
  virtuals: true,
  versionKey: false
});


Usuario.pre('save', function(next) {
  if (this.isNew || this.isModified('senha')) {
    this.senha = this.codificarSenha(this.senha);
  }

  this.data_atualizacao = Date.now;

  next();
});


Usuario.methods = {
  /**
   * Retorna uma representação do objeto sem as propriedades privadas
   */
  pegarJSON: function pegarRepresentacao() {
    var retorno = this.toObject();
    delete retorno._id;
    delete retorno.senha;

    return retorno;
  },

  /**
   * Criptografa a senha para armazenar
   */
  codificarSenha: function codificarSenha(senha) {
    if (!senha) {
      return '';
    }

    try {
      return crypto.
      createHash('sha1')
        .update(senha)
        .digest('base64');
    } catch (err) {
      return '';
    }
  },

  /**
   * Compara a senha em texto com a senha criptografada neste registro
   */
  senhaIgualA: function compararSenhas(senha) {
    return this.senha === this.codificarSenha(senha);
  }
};


module.exports = mongoose.models['Usuario'] || mongoose.model('Usuario', Usuario);
