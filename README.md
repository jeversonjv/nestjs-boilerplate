<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## 📃 Descrição

NestJS Boilerplate é uma aplicação para servir como base para iniciar um projeto.

## 📋 Funcionalidades

- [x] Login
- [x] Criar usuário

## 🛠 Em construção...

- [x] Módulo para envio de e-mails
- [x] Recuperar minha senha

## 🚀 Rodando a aplicação

É necessário ter instalado na sua máquina

- [NodeJS](https://nodejs.org/en/)
- [Git](https://git-scm.com/)
- [Yarn](https://yarnpkg.com/)

```bash
# clone a aplicação

$ git clone https://github.com/jeversonjv/nestjs-boilerplate

# entre na pasta

$ cd nestjs-boilerplate

# crie seu arquivo .env e crie o banco de dados postgres

$ cp .env.example .env

# rode a aplicação

$ yarn start:dev

# Pronto, agora a aplicação estará rodando na porta 3000
```

## Migrations

O Projeto utiliza o `synchronize` do typeorm no ambiente de desenvolvimento. Portanto não é necessário gerar e rodar migrations em modo dev. Basta rodar a aplicação que já estará sincronizado.

Já no ambiente de produção é necessário utilizar as migrations. Para gerar nvoas migrations `yarn migration:generate` e para rodar `yarn migration:run`

## 👦 Autor

Desenvolvido por <b>Jeverson Gonçalves</b> 👊😎👊 <br /><br />
<a href="https://github.com/jeversonjv">
<img src="https://avatars.githubusercontent.com/u/46850397?v=4" width="80px;" alt="Jeverson Gonçalves" style="border-radius:50%"/>
</a>

[![Linkedin Badge](https://img.shields.io/badge/-Jeverson-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/jeverson-gon%C3%A7alves-6612a214b/)](https://www.linkedin.com/in/jeverson-gon%C3%A7alves-6612a214b/)

[![Gmail Badge](https://img.shields.io/badge/-jeversontp@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:jeversontp@gmail.com)](mailto:jeversontp@gmail.com)

## 📑 Licença

O projeto é [MIT](LICENSE).
