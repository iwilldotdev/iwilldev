---
title: "Smart Generic\nFunctions"
date: "2025-06-18T00:00:00.000"
tags: ["TypeScript"]
author: "William Gonçalves"
authorImage: "https://github.com/iwilldotdev.png"
backgroundImage: "typescript"
---

What makes a lib feel "magical"? Type inference!

And you can use this today!

## Reusable functions are the heart of any project or lib

Imagine we need to return a user's name and age. The quickest solution would be this:

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
// value: { "name": "William", "age": 36 }
// type:  { name: string, age: number }
```

## And what's the problem with this?

- ❌ The function only serves for this purpose
- ❌ You probably won't use it again
- ❌ It infers a type unrelated to the original
- ❌ Or you'll declare a new type for the return

## The magic of generics + inference

Let's create a `pick` function that accepts as parameters: (a) an object and (b) an array of keys corresponding to it. As the function's return, a "partial" of the original type.

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

## The result?

A safe, precise, flexible, and reusable implementation, maintaining reference to the original type

```ts
const user: User = { 
    id: '1234', 
    name: 'William', 
    age: 36, 
    email: 'iwilldev@outlook.com.br'
}

const userNameAndAge = pick(user, ["name", "age"])
// same value 🙃: { "name": "William", "age": 36 }
// type related to original: Pick<User, "name" | "age">
```

## From there, you go to infinity and beyond 👉

- An `omit` function, to remove properties from an object

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
/* value: {
  "name": "William",
  "age": 36,
  "email": "iwilldev@outlook.com.br"
} */
// type: OmitKeys<User, "id">
```

- A `merge`, to combine two different objects

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
/* value: {
  "id": "1234",
  "name": "William",
  "age": 36,
  "email": "iwilldev@outlook.com.br",
  "role": "viewer",
  "permissions": [
    "read"
  ]
} */
// type: User & Role
```

## The possibilities are endless

With generics + inference, you write:

- ✅ Safer code
- ✅ Smarter helpers
- ✅ More elegant implementations

😎

And of course: many libs bring functions like these.

But do you need an entire lib to solve a specific problem? So master your code, embracing the power of TypeScript and everything it can do for your project!

-----

## Which function did you like the most?

Tell me in the comments!

🔁 Save, share, and follow for more content
