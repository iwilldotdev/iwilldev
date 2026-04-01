---
title: "6 Hábitos de TypeScript para\nCódigo AI-Friendly"
date: "2026-01-27T00:00:00.000"
tags: ["TypeScript"]
author: "William Gonçalves"
authorImage: "https://github.com/iwilldotdev.png"
backgroundImage: "typescript"
---

Você pede um refactor simples pro seu assistente de IA. Ele retorna um código que parece correto, mas está sutilmente errado. Cria rotas que não existem, trata erros que não podem acontecer, ou inventa combinações de estado impossíveis.

**Se a IA não entende seu código, talvez seus tipos não estejam contando a história completa.**

Não estamos mais escrevendo código só para compiladores. Estamos escrevendo contexto para nossos assistentes de IA também. Quanto mais explícitos seus tipos forem, menos espaço pra alucinações.

Aqui estão 6 estratégias pra escrever TypeScript que ajuda sua IA (e seu time) a trabalhar melhor.

---

### 1. Pare de Usar Strings para Rotas

Uma forma fácil de quebrar uma aplicação é um typo numa string de rota. Quando você escreve `router.push('/users/' + id)`, está confiando em si mesmo (e na IA) pra lembrar o caminho exato toda vez.

Modelos de IA adoram chutar aqui. Frequentemente sugerem `/user/` ao invés de `/users/` ou esquecem uma barra.

**O problema:**

```typescript
// ❌ Ambíguo. A IA tem que adivinhar qual string vai aqui.
function navigateTo(path: string) { ... }
```

**A solução: Template Literal Types**

Defina o formato das suas rotas. Isso cria uma "múltipla escolha" pra IA ao invés de uma pergunta aberta.

```typescript
const ROUTES = {
  HOME: '/',
  USERS: '/users',
  USER_DETAIL: '/users/:id',
} as const;

type AppRoute = typeof ROUTES[keyof typeof ROUTES];

function navigate(route: AppRoute) { /* ... */ }

// Uso
navigate(ROUTES.USER_DETAIL);
```

**Por que funciona:** Você cria uma fonte única da verdade. A IA consegue ver todas as rotas válidas em um lugar só e para de inventar caminhos que não existem.

---

### 2. Mate a Sopa de Booleanos

Componentes com estado tipo `isLoading`, `isError` e `isSuccess` criam estados impossíveis. O que acontece se `isLoading` e `isError` forem `true` ao mesmo tempo?

Modelos de IA sofrem com isso. Podem escrever código que renderiza dados enquanto o spinner de loading ainda está aparecendo.

**A solução: Discriminated Unions**

Faça estados impossíveis serem realmente impossíveis de escrever.

```typescript
type DataState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function UserList({ state }: { state: DataState<User[]> }) {
  switch (state.status) {
    case 'loading': return <Spinner />;
    case 'error': return <ErrorMsg error={state.error} />;
    case 'success': return <List data={state.data} />;
  }
}
```

**Por que funciona:** O campo `status` força a IA a tratar cada caso. Ela não consegue acessar `data` antes de estar carregado porque o TypeScript não permite.

---

### 3. Trate Primitivos como Objetos de Domínio

Pro TypeScript (e pra IA), uma `string` é só uma string. Não sabe que `userId` e `email` são coisas diferentes. Se você tem `sendEmail(to: string, from: string)`, a IA pode trocar eles sem perceber.

**A solução: Branded Types**

Dê significado semântico aos seus primitivos.

```typescript
type Brand<K, T> = K & { __brand: T };

type Email = Brand<string, 'Email'>;
type UserId = Brand<string, 'UserId'>;

function createEmail(value: string): Email {
  if (!value.includes('@')) throw new Error('Email inválido');
  return value as Email;
}

function sendInvite(to: Email, from: UserId) { /* ... */ }

const adminId = 'u-123' as UserId;
const userEmail = createEmail('john@example.com');

sendInvite(userEmail, adminId); // ✅
// sendInvite(adminId, userEmail); // ❌ Erro de tipo!
```

---

### 4. Mova Lógica de Negócio para os Tipos

Comentários são invisíveis pro compilador. A IA consegue ler, mas frequentemente ignora. Se você escreve `// Preço deve ser positivo`, a IA ainda pode gerar `price: -10`.

**A solução: Smart Constructors**

Coloque a lógica na criação do tipo.

```typescript
type Price = Brand<number, 'Price'>;

function createPrice(value: number): Price {
  if (value < 0) throw new Error('Preço deve ser positivo');
  return value as Price;
}

interface Product {
  name: string;
  price: Price; // Não é qualquer número
}
```

**Por que funciona:** Força a IA (e você) a usar `createPrice` pra obter um objeto válido. A validação sempre roda.

---

### 5. Pare de Jogar Strings

`try/catch` é opaco. Quando você chama uma função, não tem ideia do que ela pode lançar. Assistentes de IA são ruins em adivinhar tipos de erro em blocos catch. Frequentemente só escrevem `console.log(error)` e seguem em frente.

**A solução: Result Types**

Retorne erros como valores. Isso torna o tratamento de erros visível na assinatura da função.

```typescript
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

type FetchError = 
  | { type: 'NetworkError' } 
  | { type: 'NotFound'; id: string };

async function getUser(id: string): Promise<Result<User, FetchError>> {
  // implementação retorna objetos, não faz throw
}

// Uso
const result = await getUser('123');
if (!result.ok) {
  // A IA sabe exatamente quais erros tratar
  switch(result.error.type) {
    case 'NotFound': /* ... */
    case 'NetworkError': /* ... */
  }
}
```

**Por que funciona:** Sem mais mistério de "o que pode dar errado?". A IA consegue tratar todos os casos de erro porque estão listados no tipo.

---

### 6. Bônus: Não Confie em Nada de Fora

Branded Types (Dica #4) são ótimos pra lógica interna. Mas dados de fora (APIs, formulários) são imprevisíveis. Se você escreve `as User` numa resposta de API, está mentindo pro compilador. E a IA vai acreditar nessa mentira.

**A solução: Validação de Schema em Runtime**

Use bibliotecas como Zod pra conectar dados de runtime com tipos estáticos.

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['admin', 'user']),
});

type User = z.infer<typeof UserSchema>;

async function fetchUser(id: string) {
  const data = await fetch(`/api/users/${id}`).then(res => res.json());
  return UserSchema.parse(data); // Se passar, o tipo é real
}
```

---

### Conclusão

Escrever código AI-friendly não é sobre simplificar as coisas. É sobre ser **explícito**.

TypeScript é uma forma de documentação legível por máquina. Quando você usa esses padrões, cria um contrato que tanto seu compilador quanto seu assistente de IA conseguem entender.

Na próxima vez que sua IA alucinar algo estranho, pergunte-se: dei contexto suficiente nos tipos?

-----

Gostou desse conteúdo? Compartilha com seus amigos devs!

Até a próxima!
