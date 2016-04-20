# cs-node

Modelo de API RESTful em Node.JS com Express, utilizando autenticação via tokens JWT (JSON Web Token).

[![Build status](https://ci.appveyor.com/api/projects/status/gdshd1218kmqaord?svg=true)](https://ci.appveyor.com/project/rcdmk/cs-node)

<br>

### Resposta padrão

Toda comunicação possui respostas padrão para mensagens de erro:

>**HTTP Status:** 400, 401, 500, 503, etc.

```json
{
  "mensagem": "mensagem de retorno"
}
```
<br>

### POST /usuarios

Cadastro de usuários para autenticação e consulta.

**Envio:**

```json
{
  "nome": "Nome usuário",
  "email": "email@testes.com",
  "senha": "12345",
  "telefones": [
	{ "ddd": "11", "numero": "12345678" },
	{ "ddd": "12", "numero": "987654321" }
  ]
}
```

**Resposta:**

>**HTTP Status:** 201  
>**Headers:** Location /usuarios/[id_usuario]  
>(**id_usuario** vem preenchido com o id do usuário criado)

```json
{
  "id": "abcdef1234567890abcdef12",
  "nome": "Nome usuário",
  "email": "email@testes.com",
  "telefones": [
	{ "ddd": "11", "numero": "12345678" },
	{ "ddd": "12", "numero": "987654321" }
  ],
  "data_criacao": "2016-04-10T12:25:32Z",
  "data_atualizacao": "2016-04-10T12:25:32Z"
}
```
<br>

### POST /autenticacao

Autenticação do usuário para obter o token.

**Envio:**

```json
{
  "nome": "Nome usuário",
  "email": "email@testes.com"
}
```

**Resposta:**

>*HTTP Status:* 200

```json
{
  "id": "abcdef1234567890abcdef12",
  "nome": "Nome usuário",
  "email": "email@testes.com",
  "telefones": [
	{ "ddd": "11", "numero": "12345678" },
	{ "ddd": "12", "numero": "987654321" }
  ],
  "data_criacao": "2016-04-10T12:25:32Z",
  "data_atualizacao": "2016-04-10T12:25:32.000Z",
  "ultimo_login": "2016-04-10T12:29:05.000Z",
  "token": "abcdef01234567890abcdef01234567890abcdef01234567890abcdef01234567890abcdef01234567890abcdef.01234567890abcdef01234567890"
}
```
<br>

### GET /usuarios/:id_usuario

Obtém os dados do usuário solicitado.

**Envio:**

>**Headers:** Authorization: Bearer [token]  
>(**token** deve ser preenchido com o token de autorização do usuário, obtido na autenticação)

**Resposta:**

```json
{
  "id": "abcdef1234567890abcdef12",
  "nome": "Nome usuário",
  "email": "email@testes.com",
  "telefones": [
	{ "ddd": "11", "numero": "12345678" },
	{ "ddd": "12", "numero": "987654321" }
  ],
  "data_criacao": "2016-04-10T12:25:32Z",
  "data_atualizacao": "2016-04-10T12:25:32.000Z",
  "ultimo_login": "2016-04-10T12:29:05.000Z",
  "token": "abcdef01234567890abcdef01234567890abcdef01234567890abcdef01234567890abcdef01234567890abcdef.01234567890abcdef01234567890"
}
```
