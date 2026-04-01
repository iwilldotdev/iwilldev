---
title: "React Router 7: \n'Multiple Actions' in a Single Route"
date: "2025-06-26T00:00:00.000"
tags: ["React Router", "Remix"]
author: "William Gonçalves"
authorImage: "https://github.com/iwilldotdev.png"
backgroundImage: "react-router"
---

This is perhaps the most common misconception for those unfamiliar with React Router as a framework (and the same goes for Remix):

> I can only have one action per route.

I believe this confusion arises mainly from comparisons with Next.js, its Server Actions, and even the way API routes are declared in it.

Many developers see React Router's `loader` and `action` functions as "endpoints," functions with single responsibilities, when in reality, their true role goes far beyond that.

`loader` and `action`, together, are like a complete Controller, where we can define different fetches and distinct mutations, each with its own purpose.

And that's part of what we'll study here, by simulating a user CRUD: three different ways to handle multiple actions in a single React Router route. And if you use Remix up to version 2 (pre-React Router 7), the same approaches should work for you.

---

### Using the Form component and default behavior

This is the most traditional approach. We use the `<Form>` component and differentiate actions through the `method` attribute.

In a route, create the `loader`:

```tsx
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const users = await getUsers();
  return data({ users });
};
```

Create your component with different forms, one for each different method/action:

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

      {/* Form with method="post" to create a user */}
      <Form method="post" className="flex gap-4">
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <button type="submit">Create User</button>
      </Form>

      <hr className="my-8" />
      <h2>Users</h2>
      <div className="flex flex-col gap-4">
        {users.map((user: User) => (
          <div key={user.id} className="py-4 gap-4 flex items-center">

            {/* Form with method="put" to edit a user */}
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

            {/* Form with method="delete" to delete a user */}
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

In the same route, define the `action`. We use `await request.formData()` to read the data and get `request.method` to differentiate between POST, PUT, and DELETE.

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

And that's it!

This approach is robust, works without JavaScript, and follows the principle of Progressive Enhancement.

Its disadvantage (compared to the other options) is that the number of mutations is limited to the standard HTTP methods.

---

### With useSubmit and JSON - actions defined in the submitted data

In this method, we will use the `useSubmit` hook to send a JSON with a property called `intent`, which will define which action we want to perform. The first advantage here is that we gain the flexibility for custom mutations, outside the standard `method` patterns of the `<Form>` component.

We'll use the same loader as the previous example:

```tsx
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const users = await getUsers();
  return data({ users });
};
```

In the route's component, we define event handlers to deal with user actions and trigger the corresponding mutation. The main advantage here, for example, is being able to separate the user `role` editing from the other properties into a distinct action.

```tsx
export default function UI({
  loaderData: { users },
}: Route.ComponentProps) {
  const submit = useSubmit();

  // Event handler to create a user
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

  // Event handler to edit a user
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

  // Event handler to change the user's role
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

  // Event handler to delete a user
  const handleDelete = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
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

      {/* Form to create a user */}
      <form onSubmit={handleCreate} className="flex gap-4">
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <button type="submit">Create User</button>
      </form>

      <hr className="my-8" />
      <h2>Users</h2>
      <div className="flex flex-col gap-4">
        {users.map((user: User) => (

          {/* Form to edit a user */}
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

            {/* Event that triggers the role change handler */}
            <select defaultValue={user.role} onChange={handleChangeRole}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {/* Click event to delete a user */}
            <button type="button" className="!bg-red-500 hover:!bg-red-600" onClick={() => handleDelete(user.id)}>Delete</button>
          </form>
        ))}
      </div>
      <hr className="my-8" />
    </div>
  );
}
```

In the same route, define the `action`. We use `await request.json()` to read the data and get the `intent` property from the body to address the mutation:

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

This version is ideal for more complex data structures, like nested objects, due to the flexibility that JSON provides.

You can use Discriminated Unions with TypeScript to ensure strong typing of the payloads.

The disadvantage is that it depends on JavaScript and becomes much more verbose, especially in the examples I'm showing here.

Another point is that for file uploads, using FormData is still the best option. We want to avoid base64 encoding at all costs.

---

### Actions as route parameters - the most delightful of the three options

Here, we return to the `Form` component. But instead of using the `method` attribute to differentiate actions, we will use the `action` attribute.

We'll use the same loader as in the previous examples:

```tsx
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const users = await getUsers();
  return data({ users });
};
```

In the UI, we use the `Form` component, associating the desired mutation with the `action` parameter, and we also set `navigate={false}` for each form to prevent navigations and changes to the browser history (you'll understand why in a moment):

```tsx
export default function UI({ loaderData: { users } }: Route.ComponentProps) {
  return (
    <div className="container flex flex-col gap-5 mx-auto p-8">
      <h1>Users CRUD (Actions as params)</h1>
      <h2>Add User</h2>

      {/* Form to create a user */}
      <Form action="createUser" method="post" navigate={false} className="flex gap-4">
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <button type="submit">Create User</button>
      </Form>

      <hr className="my-8" />
      <h2>Users</h2>
      <div className="flex flex-col gap-4">
        {users.map((user: User) => (
          <div className="py-4 gap-4 flex items-center justify-between">

            {/* Form to update a user */}
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

            {/* Form to change user's role */}
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

            {/* Form to delete a user */}
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

Before moving on to the `action`, let's understand what will happen here:

Imagine this route is `/users`. When I delete a user, for example, the form will look for `deleteUser` as a child route of `/users`: `/users/deleteUser`. Therefore, for this method, we will need to create an additional route dedicated to the actions.

> Oh, William! But you said everything would be in the same route!

Yes, young grasshopper! The actions will still be concentrated in a single route.

But to gain flexibility, accommodate a more complex UI with multiple (including custom) actions, maintain the default behavior of forms, and achieve this with simple and elegant code, it can't come for free.

And the price is to separate the actions into a route with a dynamic segment.

In the `/users` example, this route would be `/users/:action`, declared manually, or `users.$action.tsx` using the <a href="https://reactrouter.com/how-to/file-route-conventions#file-route-conventions" target="_blank">File Route Conventions</a> (which work exactly like in Remix).

Here we go back to using `request.formData()` and now get the action from the route parameter.

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

And why do I think this is the best approach?

Because it maintains the default behaviors of React Router (and also Remix) while providing flexibility for different scenarios.

The `action` ceases to be a "narrow path," giving way to countless possibilities, in addition to serving to centralize and organize the different mutations that a screen and its components perform.

---

You can check out the <a href="https://github.com/iwilldotdev/rr7-multiple-actions" target="_blank">complete example in the repository</a>, where I have defined different routes for each approach.

And also test it <a href="https://rr7-multiple-actions.vercel.app/" target="_blank">live</a>, to get a better view of the different scenarios, inspect the app, and everything else.

---

I hope you enjoyed it!

And share it with your developer friends who need to learn more about React Router 7!

See you around!