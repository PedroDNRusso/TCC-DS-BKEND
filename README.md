# TCC (Trabalho de Conclusão de Curso) - Back-End para teste em Insomnia e Swagger
Repositorio de Back-End para teste (Insomnia e Swagger)

## Integrantes: 
* Pedro Duarte, 
* Rodrigo Passberg, 
* Lizzie de Sousa,
* Mellyssa S.

## Instituição e Curso
Projeto desenvolvido com o intuito educacional dos alunos de Desevolvimento de Sistemas - SENAI Jaguariúna

## Ideia do Projeto
O projeto tem com objetivo o desenvolvimento de um diagnostico digital, onde o usuário irá colocar seus sintomas e ira receber uma diagnostico baseado em uma serie de dados com um ChatBot.

## Como testar 
1. Configure o ambiente de desenvolvimento com as seguintes ferramentas.

- [VsCode](https://code.visualstudio.com/)
- [XAMPP](https://www.apachefriends.org/pt_br/index.html)
- [Git](https://git-scm.com/downloads)
- [NodeJS](https://nodejs.org/pt)

2. Após a instalação das ferramentas siga esse passo para clonar o repositorio e testa-ló.

- Copie o codigo HTTP no GitHub do repositorio que queira testar, abra o Git Bash em sua area de trabalho e coloque o seguinte codígo

```bash
git clone <https://url>
```

- Agora com o repositorio clonado, entre nela com o seguinte comando

```bash
cd <nomedoarquivo>
```

- Agora dentro do arquivo clonado pelo Git Bash, digite esse comando para abri-lo no VsCode

```bash
code .
```

- Com o arquivo aberto no VsCode, abra o CMD (CRTL+"), e coloque os seguinte comandos na ordem que aparecem logo abaixo

```bash
cd api
npm i prisma -g
npm init -y
npm i express cors dotenv
npx prisma init --datasource-provider mysql
```

- Apos colocar os comandos em ordem no CMD crie um pasta chamada .env (caso os comandos dados ja tenham criado não será necessario)

```bash
DATABASE_URL="mysql://root@localhost:3306/dd-bkend?schema=public&timezone=UTC"
```

- Faremos a migração do banco de dados para o MySQL através do comando a seguir no terminal

```bash
npx prisma migrate dev --name init
```

- Implemente o comando para instalar as dependencias do Swagger 

```bash
npm install swagger-jsdoc
npm install swagger-ui-express
```

- Caso seja de interesse, coloque seu email para conectar o Git ao GitHub

```bash
git config --global user.email "seu-email@exemplo.com"
```

## Tecnologias Utilizadas para o Desenvolvimento
| Linguagens e Ferramentas  | Funcionalidade |
| ------------- |:-------------:|
| [JavaScript (Vanilla)](https://262.ecma-international.org/)  | Controle |
| [ORM Prisma](https://262.ecma-international.org/)  | Ferramenta de source que auxilia banco de dados |
| [Swagger](https://swagger.io/)  | Conjunto de ferrementas para contruir, projetar, documentar e consumir APIs |
| [Vscode](https://code.visualstudio.com/)    | IDE (Ambiente integrado de desenvolvimento) |
| [Insomnia](https://insomnia.rest/download)   | Testar, criar e simular APIs |
| [NodeJS](https://nodejs.org/pt)    | Interpretar codigos em JavaScript (Vanilla) |
| [XAMPP](https://www.apachefriends.org/pt_br/index.html)    | Software que gera um servidor web local (Banco de Dados) |
| [Git](https://git-scm.com/downloads)    | Ferramenta colaborativa de versionamento |

## Github dos Desenvolvedores
* [Pedro Duarte](https://github.com/PedroDNRusso)
* [Mellyssa Silveira](https://github.com/mellyssaS)
* [Rodrigo Passberg](https://github.com/RodrigoPassberg)
* [Lizzie de Sousa](https://github.com/BigLizziee)

## Github dos Professores
* [Wellington Fábio de Oliveira Martins](https://github.com/wellifabio)
* [Luís Fernando](https://github.com/luisfernandospoljaric)
* [Reenye Lima](https://github.com/ReenyeLima)
* [Robson Souza](https://github.com/robsonbsouzaa)

