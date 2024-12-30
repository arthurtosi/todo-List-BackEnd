# todo-List-BackEnd

# Descrição

Este projeto é uma API RESTful para gerenciar uma lista de tarefas (Todo List) com suporte a múltiplos usuários. A API permite criar, atualizar, excluir e listar tarefas associadas a cada usuário. A autenticação é baseada em tokens JWT, garantindo que cada usuário só tenha acesso às suas próprias tarefas.

# Ferramentas Utilizadas

## Linguagens e Frameworks
	•	Node.js: Plataforma para execução de JavaScript no backend.
	•	TypeScript: Superconjunto do JavaScript que adiciona tipagem estática ao projeto.
	•	Express: Framework minimalista para construir APIs no Node.js.

## Banco de Dados
	•	PostgreSQL: Banco de dados relacional utilizado para armazenar usuários e tarefas.
	•	pg (node-postgres): Biblioteca para conectar o Node.js ao PostgreSQL.

## Autenticação
	•	JWT (JSON Web Tokens):
	•	Utilizado para autenticar e autorizar usuários.
	•	Gera tokens que identificam usuários após o login.

## Gerenciamento de Ambiente
	•	dotenv: Carrega variáveis de ambiente do arquivo .env para configurar conexões e chaves de forma segura.

# Estrutura do Projeto

A estrutura de pastas segue a separação de responsabilidades para facilitar a manutenção e escalabilidade:
src/
├── config/
│   └── db.ts              # Configuração da conexão com o banco de dados
├── controllers/
│   ├── userController.ts  # Lógica de requisições relacionadas a usuários
│   └── taskController.ts  # Lógica de requisições relacionadas a tarefas
├── middlewares/
│   └── authMiddleware.ts  # Middleware de autenticação e verificação de tokens
├── routes/
│   ├── userRoutes.ts      # Rotas para usuários
│   └── taskRoutes.ts      # Rotas para tarefas
├── services/
│   ├── userService.ts     # Funções para manipulação de dados de usuários
│   └── taskService.ts     # Funções para manipulação de dados de tarefas
├── utils/
│   └── jwtUtils.ts        # Funções para geração e verificação de tokens JWT
├── server.ts              # Configuração principal do servidor
└── @types/
    └── express/index.d.ts # Extensão da tipagem do Express para incluir req.user

## Descrição das Pastas
	•	config/: Contém configurações globais, como a conexão com o banco de dados.
	•	controllers/: Define a lógica das rotas, chamando funções dos serviços e retornando respostas ao cliente.
	•	middlewares/: Contém funções intermediárias, como autenticação, que são executadas antes das rotas.
	•	routes/: Define os endpoints e conecta cada rota ao seu respectivo controller.
	•	services/: Contém a lógica de manipulação de dados e regras de negócio, separando da camada de controle.
	•	utils/: Inclui funções auxiliares, como geração e validação de tokens JWT.


# Lógica do Projeto

## Usuários
	•	Cada usuário possui:
	•	ID (UUID gerado automaticamente).
	•	Nome, email e senha.
	•	A senha é armazenada de forma segura com hash (ex.: bcrypt).

Tarefas
	•	Cada tarefa possui:
	•	ID (número único gerado automaticamente).
	•	Título, descrição, status (pending, done) e data de criação.
	•	Um vínculo com o ID do usuário que a criou (chave estrangeira).

## Autenticação
	•	Após o login, um token JWT é gerado e deve ser enviado no cabeçalho de cada requisição protegida: