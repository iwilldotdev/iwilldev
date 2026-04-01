---
title: "Funções \nGenéricas \nInteligentes"
date: "2025-06-18T00:00:00.000"
tags: ["TypeScript"]
author: "William Gonçalves"
authorImage: "https://github.com/iwilldotdev.png"
backgroundImage: "typescript"
---

O que faz uma lib parecer "mágica"? Inferência de tipos!

E você pode usar isso hoje!

## Funções reutilizáveis são o coração de qualquer projeto ou lib

Imagine que precisamos retornar nome e idade de um usuário. A solução mais rápida seria essa:

```ts
type User = {
    id: string;
    name: string;
    age: number;
    email: string;
}

function getNameAndAge(user: User): { name: string; age: number } {
  return {
    name: user.name,
    age: user.age,
  };
}

const user: User = { 
    id: '1234', 
    name: 'William', 
    age: 36, 
    email: 'iwilldev@outlook.com.br'
}

const userNameAndAge = getNameAndAge(user);
// valor: { "name": "William", "age": 36 }
// tipo:  { name: string, age: number }
```

## E qual é o problema nisso?

- ❌ A função só serve pra isso
- ❌ Você provavelmente não vai usar de novo
- ❌ Ela infere um tipo sem relação com o original
- ❌ Ou você vai declarar um novo tipo pro retorno

## A mágica dos generics + inferência

Vamos criar uma função `pick` que aceita como parâmetro: (a) um objeto e (b) um array de chaves correspondentes a ele. Como retorno da função, um "partial" do tipo original.

```ts
function pick<T, K extends keyof T>(
  obj: T, 
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}
```

## O resultado?

Uma implementação segura, precisa, flexível e reutilizável, mantendo referência ao tipo original

```ts
const user: User = { 
    id: '1234', 
    name: 'William', 
    age: 36, 
    email: 'iwilldev@outlook.com.br'
}

const userNameAndAge = pick(user, ["name", "age"])
// valor igual 🙃: { "name": "William", "age": 36 }
// tipo relacionado ao original: Pick<User, "name" | "age">
```

## A partir daí, você vai ao infinito e além 👉

- Uma função `omit`, para remover propriedades de um objeto

```ts
type OmitKeys<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

function omit<T, K extends keyof T>(
  obj: T,
  keys: K[]
): OmitKeys<T, K> {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}

const userWithoutId = omit(user, ["id"])
/* valor: {
  "name": "William",
  "age": 36,
  "email": "iwilldev@outlook.com.br"
} */
// tipo: OmitKeys<User, "id">
```

- Uma `merge`, para combinar dois objetos diferentes

```ts
// const user: User = { ... }

type Role = {
  role: 'admin' | 'editor' | 'viewer';
  permissions: Array<'read' | 'write' | 'delete' | 'update'>;
};

const role: Role = {
    role: 'viewer',
    permissions: ['read']
}

const userWithRole = merge(user, role)
/* valor: {
  "id": "1234",
  "name": "William",
  "age": 36,
  "email": "iwilldev@outlook.com.br",
  "role": "viewer",
  "permissions": [
    "read"
  ]
} */
// tipo: User & Role
```

## As possibilidades são infinitas

Com generics + inferência, você escreve:

- ✅ Código mais seguro
- ✅ Helpers mais inteligentes
- ✅ Implementações mais elegantes

😎

E claro: muitas libs trazem funções como essas. 

Mas será que você precisa de uma lib inteira, pra resolver um problema pontual? Então domine seu código, abraçando o poder do TypeScript e tudo o que ele pode fazer pelo seu projeto!

-----

## Qual função você mais curtiu?

Me conta aí nos comentários!

🔁 Salve, compartilhe e siga para mais conteúdo