# Favorite Links API

API REST para organizar links pessoais com tags e categorias.

## 🚀 Deploy

https://favorite-links.onrender.com

Documentação interativa: https://favorite-links.onrender.com/docs

## 🛠️ Stack

- Node.js + Express + TypeScript
- Prisma 7 + PostgreSQL (Neon)
- JWT + bcrypt
- Jest + Supertest

## 📦 Instalação

```bash
git clone https://github.com/nandohawkeye/favorite_links_api
cd favorite_links_api
npm install
```

Configure as variáveis de ambiente:

```env
DATABASE_URL=sua_url_do_postgresql
JWT_SECRET=sua_chave_secreta
```

Rode as migrations:

```bash
npx prisma migrate dev
```

Inicie o servidor:

```bash
npm run dev
```

## 🧪 Testes

Configure o `.env.test` com uma `DATABASE_URL` separada e rode:

```bash
npm test
```

## 📋 Endpoints

| Método | Rota           | Descrição         | Auth |
| ------ | -------------- | ----------------- | ---- |
| POST   | /auth/register | Cadastrar usuário | ❌   |
| POST   | /auth/login    | Fazer login       | ❌   |
| GET    | /links         | Listar links      | ✅   |
| POST   | /links         | Criar link        | ✅   |
| PUT    | /links/:id     | Atualizar link    | ✅   |
| DELETE | /links/:id     | Deletar link      | ✅   |
| GET    | /tags          | Listar tags       | ✅   |
| POST   | /tags          | Criar tag         | ✅   |
| PUT    | /tags/:id      | Atualizar tag     | ✅   |
| DELETE | /tags/:id      | Deletar tag       | ✅   |

## 🗄️ Modelo de dados

- **User** — email e senha
- **Link** — url, título, pertence a um usuário, pode ter várias tags
- **Tag** — nome, cor (hex), ícone (unicode), pertence a um usuário
