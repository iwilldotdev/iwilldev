---
title: "6 TypeScript Habits for\nAI-Friendly Code"
date: "2026-01-27T00:00:00.000"
tags: ["TypeScript"]
author: "William Gonçalves"
authorImage: "https://github.com/iwilldotdev.png"
backgroundImage: "typescript"
---

You ask your AI assistant for a simple refactor. It returns code that looks correct but is subtly wrong. It creates routes that don't exist, handles errors that can't happen, or invents impossible state combinations.

**If your AI doesn't understand your code, maybe your types aren't telling the full story.**

We're not just writing code for compilers anymore. We're also writing context for our AI teammates. The more explicit your types are, the less room for hallucinations.

Here are 6 strategies to write TypeScript that helps your AI (and your team) work better.

---

### 1. Stop Using Strings for Routes

One easy way to break an app is a typo in a route string. When you write `router.push('/users/' + id)`, you're trusting yourself (and the AI) to remember the exact path every time.

AI models love to guess here. They often suggest `/user/` instead of `/users/` or miss a slash.

**The problem:**

```typescript
// ❌ Ambiguous. The AI has to guess what string goes here.
function navigateTo(path: string) { ... }

```

**The solution: Template Literal Types**

Define the shape of your routes. This creates a "multiple choice" for the AI instead of an open question.

```typescript
const ROUTES = {
  HOME: '/',
  USERS: '/users',
  USER_DETAIL: '/users/:id',
} as const;

type AppRoute = typeof ROUTES[keyof typeof ROUTES];

function navigate(route: AppRoute) { /* ... */ }

// Usage
navigate(ROUTES.USER_DETAIL);
```

**Why it works:** You create a single source of truth. The AI can see all valid routes in one place and stops inventing paths that don't exist.

---

### 2. Kill the Boolean Soup

Components with state like `isLoading`, `isError`, and `isSuccess` create impossible states. What happens if `isLoading` and `isError` are both `true`?

AI models struggle with this. They might write code that renders data while the loading spinner is still showing.

**The solution: Discriminated Unions**

Make impossible states actually impossible to write.

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

**Why it works:** The `status` field forces the AI to handle every case. It can't access `data` before it's loaded because TypeScript won't allow it.

---

### 3. Treat Primitives Like Domain Objects

To TypeScript (and AI), a `string` is just a string. It doesn't know that `userId` and `email` are different things. If you have `sendEmail(to: string, from: string)`, the AI can swap them without noticing.

**The solution: Branded Types**

Give your primitives semantic meaning.

```typescript
type Brand<K, T> = K & { __brand: T };

type Email = Brand<string, 'Email'>;
type UserId = Brand<string, 'UserId'>;

function createEmail(value: string): Email {
  if (!value.includes('@')) throw new Error('Invalid email');
  return value as Email;
}

function sendInvite(to: Email, from: UserId) { /* ... */ }

const adminId = 'u-123' as UserId;
const userEmail = createEmail('john@example.com');

sendInvite(userEmail, adminId); // ✅
// sendInvite(adminId, userEmail); // ❌ Type error!

```

---

### 4. Move Business Logic into Types

Comments are invisible to the compiler. AI can read them, but often ignores them. If you write `// Price must be positive`, the AI might still generate `price: -10`.

**The solution: Smart Constructors**

Put the logic into the type creation.

```typescript
type Price = Brand<number, 'Price'>;

function createPrice(value: number): Price {
  if (value < 0) throw new Error('Price must be positive');
  return value as Price;
}

interface Product {
  name: string;
  price: Price; // Not just any number
}
```

**Why it works:** It forces the AI (and you) to use `createPrice` to get a valid object. The validation always runs.

---

### 5. Stop Throwing Strings

`try/catch` is opaque. When you call a function, you have no idea what it might throw. AI assistants are bad at guessing error types in catch blocks. They often just write `console.log(error)` and move on.

**The solution: Result Types**

Return errors as values. This makes error handling visible in the function signature.

```typescript
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

type FetchError = 
  | { type: 'NetworkError' } 
  | { type: 'NotFound'; id: string };

async function getUser(id: string): Promise<Result<User, FetchError>> {
  // implementation returns objects, not throws
}

// Usage
const result = await getUser('123');
if (!result.ok) {
  // The AI knows exactly which errors to handle
  switch(result.error.type) {
    case 'NotFound': /* ... */
    case 'NetworkError': /* ... */
  }
}

```

**Why it works:** No more "what could go wrong?" mystery. The AI can handle all error cases because they're listed in the type.

---

### 6. Bonus: Trust Nothing at the Edge

Branded Types (Tip #4) are great for internal logic. But data from outside (APIs, forms) is unpredictable. If you write `as User` on an API response, you're lying to the compiler. And the AI will believe that lie.

**The solution: Runtime Schema Validation**

Use libraries like Zod to connect runtime data with static types.

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
  return UserSchema.parse(data); // If this passes, the type is real
}
```

---

### Wrapping Up

Writing AI-friendly code isn't about simplifying things. It's about being **explicit**.

TypeScript is a form of machine-readable documentation. When you use these patterns, you create a contract that both your compiler and your AI partner can understand.

Next time your AI hallucinates something weird, ask yourself: did I give it enough context in the types?

-----

Did you like this content? Share it with your dev friends!

See you around!