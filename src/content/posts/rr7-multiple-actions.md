---
title: "React Router 7: \n'Múltiplas Actions' em uma única rota"
date: "2025-06-26T00:00:00.000"
tags: ["React Router", "Remix"]
author: "William Gonçalves"
authorImage: "https://github.com/iwilldotdev.png"
backgroundImage: "react-router"
i18n: "en"
---

Talvez esse seja a má interpretação mais comum de quem não conhece o React Router como framework (e o mesmo vale para o Remix):

> Só consigo fazer uma action por rota

Eu acredito que essa confusão se dê principalmente pelas comparações com o Next.js, suas Server Functions e até a forma como as rotas de API são declaradas nele. 

Muitos desenvolvedores enxergam as funções `loader` e `action` do React Router como "endpoints", funções com responsabilidades únicas, quando na verdade o verdadeiro papel delas vai muito além disso.

`loader` e `action`, juntas, são como um Controller completo, onde podemos definir diferentes buscas e mutações distintas, cada uma com seu propósito.

E é sobre parte disso que estudaremos aqui, simulando um CRUD de usuários: três maneiras diferentes de fazer múltiplas actions em uma única rota do React Router. E se você usa Remix até a versão 2 (pré-React Router 7), as mesmas abordagens devem servir para você.

---

### Usando o componente Form e comportamento padrão

Esta é a abordagem mais tradicional. Usamos o componente `<Form>` e diferenciamos as ações através do atributo `method`.

Em uma rota, crie a `loader`:

```tsx
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const users = await getUsers();
  return data({ users });
};
```

Crie seu componentes com diferentes formulários, um para cada método/ação diferente:

```tsx
import {
    Form,
    /* ... */
} from "react-router";

/* ... */

export default function UI({ loaderData: { users } }: Route.ComponentProps) {
  return (
    <div className="container flex flex-col gap-5 mx-auto p-8">
      <h1>Users CRUD (Form - default behavior)</h1>
      <h2>Add User</h2>

      {/* Formulário com method="post" para criar usuário */}
      <Form method="post" className="flex gap-4">
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <button type="submit">Criar Usuário</button>
      </Form>

      <hr className="my-8" />
      <h2>Users</h2>
      <div className="flex flex-col gap-4">
        {users.map((user: User) => (
          <div key={user.id} className="py-4 gap-4 flex items-center">

            {/* Formulário com method="put" para editar usuário */}
            <Form
              method="put"
              className="py-4 gap-4 flex items-center flex-1"
              data-user-id={user.id}
            >
              <input name="name" type="text" defaultValue={user.name} />
              <input name="email" type="email" defaultValue={user.email} />
              <div className="ml-auto">
                <strong>Role:</strong>
              </div>
              <select name="role" defaultValue={user.role}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit">Save</button>
            </Form>

            {/* Formulário com method="delete" para excluir usuário */}
            <Form method="delete">
              <input type="hidden" name="id" value={user.id} />
              <button type="submit" className="!bg-red-500 hover:!bg-red-600">
                Delete
              </button>
            </Form>
          </div>
        ))}
      </div>
      <hr className="my-8" />
    </div>
  );
}
```

Na mesma rota, defina a `action`. Usamos `await request.formData()` para ler os dados e pegamos o `request.method` para diferenciar POST, PUT e DELETE.

```tsx
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const method = request.method.toLowerCase();
  switch (method) {
    case "post": {
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      return await createUser({ name, email });
    }
    case "put": {
      const id = formData.get("id") as string;
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      return await updateUser(id, { name, email });
    }
    case "delete": {
      const id = formData.get("id") as string;
      return await deleteUser(id);
    }
    default:
      throw new Response("Method not allowed", {
        status: 405,
        statusText: "Method Not Allowed",
      });
  }
};
```

E é isso!

Esta abordagem é robusta, funciona sem JavaScript e segue o princípio do Progressive Enhancement.

Sua desvantagem (em relações às outras opções) é que a quantidade de mutações fica limitada aos métodos padrões.

---

### Com useSubmit e JSON - actions definidas nos dados enviados

Nesse método, utilizaremos o hook `useSubmit`, para enviar um JSON com propriedade chamada `intent`, que definirá qual action desejamos performar. A primeira vantagem daqui é que ganhamos a flexibilidade de mutações customizadas, fora dos padrões de `method` no componente `<Form>`.

Usaremos a mesma loader do exemplo anterior:

```tsx
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const users = await getUsers();
  return data({ users });
};
```

No componente da rota, definimos event handlers para lidar com as ações do usuário e disparar a mutação correspondente. A principal vantagem aqui, por exemplo, é poder separar a edição do `role` de usuário das demais propriedades, em uma action distinta.

```tsx
export default function UI({
  loaderData: { users },
}: Route.ComponentProps) {
  const submit = useSubmit();

  // Event handler para criar usuário
  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name"));
    const email = String(formData.get("email"));
    const data = { intent: "createUser", payload: { name, email } };
    submit(JSON.stringify(data), {
      method: "post",
      encType: "application/json",
    });
    event.currentTarget.reset();
  };

  // Event handler para editar usuário
  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userId = event.currentTarget.getAttribute("data-user-id");
    if (userId) {
      const name = String(formData.get("name"));
      const email = String(formData.get("email"));
      const data = {
        intent: "updateUser",
        payload: { id: userId, name, email },
      };
      submit(JSON.stringify(data), {
        method: "post",
        encType: "application/json",
      });
    }
  };

  // Event handler para alterar o cargo do usuário
  const handleChangeRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = event.target.closest("form")?.getAttribute("data-user-id");
    if (userId) {
      const role = event.target.value as "admin" | "user";
      const data = { intent: "changeUserRole", payload: { id: userId, role } };
      submit(JSON.stringify(data), {
        method: "post",
        encType: "application/json",
      });
    }
  };

  // Event handler para excluir usuário
  const handleDelete = (userId: string) => {
    if (confirm("Tem certeza que deseja deletar este usuário?")) {
      const data = { intent: "deleteUser", payload: { id: userId } };
      submit(JSON.stringify(data), {
        method: "post",
        encType: "application/json",
      });
    }
  };

  return (
    <div className="container flex flex-col gap-5 mx-auto p-8">
      <h1>Users CRUD (JSON API)</h1>
      <h2>Add User</h2>

      {/* Formulário para criar usuário */}
      <form onSubmit={handleCreate} className="flex gap-4">
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <button type="submit">Criar Usuário</button>
      </form>

      <hr className="my-8" />
      <h2>Users</h2>
      <div className="flex flex-col gap-4">
        {users.map((user: User) => (

          {/* Formulário para editar usuário */}
          <form
            className="py-4 gap-4 flex items-center"
            key={user.id}
            onSubmit={handleUpdate}
            data-user-id={user.id}
          >
            <input name="name" type="text" defaultValue={user.name} />
            <input name="email" type="email" defaultValue={user.email} />

            <button type="submit">Save</button>
            <div className="ml-auto">
              <strong>Role:</strong>
            </div>

            {/* Evento que dispara a handler de edição de cargo */}
            <select defaultValue={user.role} onChange={handleChangeRole}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {/* Evento de click para excluir usuário */}
            <button type="button" className="!bg-red-500 hover:!bg-red-600" onClick={() => handleDelete(user.id)}>Delete</button>
          </form>
        ))}
      </div>
      <hr className="my-8" />
    </div>
  );
}
```

Na mesma rota, defina a `action`. Usamos `await request.json()` para ler os dados e pegamos a propriedade `intent` do body, para endereçar a mutação:

```tsx
export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.json();
  const { intent, payload } = body;

  switch (intent) {
    case "createUser":
      return await createUser(payload);
    case "updateUser":
      return await updateUser(payload.id, payload);
    case "deleteUser":
      return await deleteUser(payload.id);
    case "changeUserRole":
      return await changeUserRole(payload.id, payload.role);
    default:
      throw new Error("Method not allowed");
  }
};
```

Essa versão é ideal para estruturas de dados mais complexas, como objetos aninhados, pela flexibilidade que o JSON dá.

Você pode usar `Discriminated Unions`, com o TypeScript, para garantir uma tipagem forte dos payloads.

A desvantagem é que depende de JavaScript e fica muito mais verbosa. Principalmente nos exemplos que trago aqui.

Outro ponto é que, para envio de arquivos, usar FormData ainda é a melhor opção. Deus nos livre de base64.

---

### Actions como parâmetros de rota - a mais delícia das três opções

Aqui, nós voltamos para o componente `Form`. Mas ao invés de usarmos o atributo `method`, para diferenciar as actions, usaremos o atributo `action`.

Usaremos a mesma loader dos exemplos anteriores:

```tsx
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const users = await getUsers();
  return data({ users });
};
```

Na UI usamos o componente `Form`, associando a mutação desejada ao parâmetro `action`, além de definirmos `navigate={false}` para cada um dos formulários, para evitar navegações e alterações no histórico de navegação (você vai entender o motivo em seguida):

```tsx
export default function UI({ loaderData: { users } }: Route.ComponentProps) {
  return (
    <div className="container flex flex-col gap-5 mx-auto p-8">
      <h1>Users CRUD (Actions as params)</h1>
      <h2>Add User</h2>

      {/* Formulário para criar usuário */}
      <Form action="createUser" method="post" navigate={false} className="flex gap-4">
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <button type="submit">Criar Usuário</button>
      </Form>

      <hr className="my-8" />
      <h2>Users</h2>
      <div className="flex flex-col gap-4">
        {users.map((user: User) => (
          <div className="py-4 gap-4 flex items-center justify-between">

            {/* Formulário para editar usuário */}
            <Form
              action="updateUser"
              method="post"
              navigate={false}
              className="py-4 gap-4 flex items-center"
              key={user.id}
              data-user-id={user.id}
            >
              <input name="name" type="text" defaultValue={user.name} />
              <input name="email" type="email" defaultValue={user.email} />

              <button type="submit">Save</button>
            </Form>

            {/* Formulário para mudar o cargo */}
            <Form
              action="changeUserRole"
              method="post"
              navigate={false}
              className="flex items-center gap-4"
            >
              <div>
                <strong>Role:</strong>
              </div>
              <select name="role" defaultValue={user.role}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit">Save</button>
            </Form>

            {/* Formulário para excluir usuário */}
            <Form action="deleteUser" method="post" navigate={false}>
              <input type="hidden" name="id" value={user.id} />
              <button type="submit" className="!bg-red-500 hover:!bg-red-600">
                Delete
              </button>
            </Form>
          </div>
        ))}
      </div>
      <hr className="my-8" />
    </div>
  );
}
```

Antes de avançar para a `action`, vamos entender o que acontecerá aqui:

Imagine que essa rota sejá `/users`. Quando eu excluir um usuário, por exemplo, o formulário buscará `deleteUser` como uma rota filha de `/users`: `/users/deleteUser`. Com isso, para esse método, precisaremos criar uma rota adicional, dedicada às actions.

> Ah, William! Mas você disse que seria tudo na mesma rota!

Sim, pequeno gafanhoto! As actions continuarão sendo concentradas em uma única rota.

Mas para ganhar flexibilidade, comportar uma UI mais complexa com múltiplas actions (inclusive customizadas), manter o comportamento padrão dos formulários e alcançar isso com um código simples e elegante não pode ser de graça.

E o preço é separar as actions em uma rota com segmento dinâmico. 

No exemplo `/users`, essa rota seria `/users/:action`, declarando manualmente, ou `users.$action.tsx` usando as <a href="https://reactrouter.com/how-to/file-route-conventions#file-route-conventions" target="_blank">File Route Conventions</a> (que funcionam exatamente como no Remix).

Aqui nós voltamos a usar o `request.formData()` e passamos a buscar a action no parâmetro da rota.

```tsx
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const action = params.action;

  switch (action) {
    case "createUser":
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      return await createUser({ name, email });
    case "updateUser":
      const id = formData.get("id") as string;
      const userName = formData.get("name") as string;
      const userEmail = formData.get("email") as string;
      return await updateUser(id, { name: userName, email: userEmail });
    case "deleteUser":
      const deleteId = formData.get("id") as string;
      return await deleteUser(deleteId);
    case "changeUserRole":
      const roleId = formData.get("id") as string;
      const role = formData.get("role") as "admin" | "user";
      return await changeUserRole(roleId, role);
    default:
      throw new Error("Method not allowed");
  }
};
```

E porque eu acho que ela é a melhor abordagem?

Porque mantem os comportamentos padrão do React Router (e também do Remix) ao mesmo tempo em que dá flexibilidade para diferentes cenários. 

A `action` deixa de ser um "caminho estreito" dando espaço para inúmeras possibilidades, além de servir para concentrar e organizar as diferentes mutações que uma tela e seus componentes fazem.

---

Você pode conferir o <a href="https://github.com/iwilldotdev/rr7-multiple-actions" target="_blank">exemplo completo no repositório</a>, onde defini diferentes rotas para cada abordagem.

E também testar <a href="https://rr7-multiple-actions.vercel.app/" target="_blank">ao vivo</a>, para ter uma melhor visualização dos diferentes cenários, inspecionar o app e tudo mais.

---

Espero que você tenha curtido!

E compartilhe com seus amigos desenvolvedores que precisam conhecer mais sobre o React Router 7!

A gente se vê!