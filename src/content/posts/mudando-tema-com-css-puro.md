---
title: "Mudando tema da tela com CSS Puro (Dark/Light Mode)"
date: "2021-01-03T00:00:00.000"
tags: ["CSS"]
author: "William Gonçalves"
authorImage: "https://github.com/iwilldotdev.png"
backgroundImage: "css"
---

## *We know the JS way*

### *Mas e se não usarmos scripts para trocar o tema das nossas aplicações?*

O caminho é uma relação entre cascata e seletores bem especificados. 

Vamos do início:

----------

#### HTML

O primeiro elemento da árvore será um input do tipo checkbox.

Seu irmão abaixo será o container da nossa aplicação. Ele é quem terá os estilos alterados para a mudança de tema.

Dentro dele, teremos um label relacionado ao nosso input lá de cima, dentro de uma div que será sua área de transição, servindo como nosso botão para mudar o tema.

```html
<body>
  <input type="checkbox" id="theme-switcher">
  <div id="app-container">
    <div class="theme-switcher-area">
      <label for="theme-switcher" class="theme-switcher-button">
      </label>
    </div>
    <h1>Mudando tema com CSS Puro</h1>
    <p>O texto fica em contraste 
    com o fundo</p>
  </div>
</body>
```

----------

#### CSS

Nos estilos, aplicamos os resets e declaramos as variáveis para as cores usadas no tema:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --light: #cccccc;
  --dark: #151515;
}
```

----------

Tornamos nosso input invisível, já que usaremos o label dele como acionador.

```css
#theme-switcher {
  display: none;
}
```

----------

E declaramos as propriedades do nosso container do app. Ele ocupará toda a tela, terá fundo claro e textos escuros, além de ser um flex-container. Esse último é opcional e só para facilitar a demonstração do resultado, centralizando o texto na tela.

```css
#app-container {
  height: 100vh;
  background: var(--light);
  color: var(--dark);
  font-family: monospace;
  font-size: 1.5rem;
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
```

----------

Declaramos a área por onde nosso botão vai deslizar, com posicionamento absoluto no topo:

```css
.theme-switcher-area {
  border: 1px solid var(--light);
  background: var(--dark);
  border-radius: 2rem;
  width: 4.5rem;
  height: 2.5rem;
  padding: 0.2rem;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
```

----------

O botão, em si, que usará o estilo `dashed` na borda, criando um efeito similar aos raios do sol, para o tema claro.

```css
.theme-switcher-button {
  position: relative;
  display: block;
  background: #f1aa02;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  border: 2px dashed var(--dark);
  transition: 0.3s;
}
```

----------

E por último, um pseudo-elemento `::after` sobre o botão. Ele terá a forma de um círculo menor que o elemento original, tornando-se uma sombra que transformará o acionador em uma lua, no tema escuro. Por isso, sua opacidade inicial será 0.

```css
.theme-switcher-button::after {
  position: absolute;
  width: 80%;
  height: 80%;
  content: "";
  background: var(--dark);
  border-radius: 50%;
  opacity: 0;
  transition: 0.3s;
}
```

----------

## E aí vem a mágica!

Como nosso input é o primeiro elemento da árvore, podemos usar a pseudo-classe ':checked', com os seletores apropriados, para mudar o estilo de qualquer elemento abaixo dele. 

Quando ele for selecionado, essas propriedades serão aplicadas.

Começando pelo próprio acionador, transformando o sol em lua. Para isso, removemos a borda que veio para dar o efeito dos raios e deslocamos o botão para a direita.

```css
#theme-switcher:checked + #app-container .theme-switcher-button {
    transform: translateX(100%);
    border: none;
}
```

----------

Em seguida, mudamos a opacidade da sombra, o `::after`, para gerar uma lua crescente, na mudança do botão.

```css
#theme-switcher:checked + #app-container .theme-switcher-button::after {
    opacity: 1;
}
```

----------

Por último e pelo efeito desejado, invertemos a cor de fundo e de texto do nosso container da aplicação:

```css
#theme-switcher:checked + #app-container {
    background: var(--dark);
    color: var(--light);
}
```

----------

### E tá lá, onde a coruja dorme!

![Demonstração de mudança de tema usando só CSS](https://dev-to-uploads.s3.amazonaws.com/i/9q8ffcms8zgj2gqccihs.gif)
 
----------

Esse tutorial é só o início do mergulho. Por isso, use sua criatividade a partir dessa base e mude os estilos como você achar melhor!

----------

Se você curtiu esse conteúdo, compartilhe com outras pessoas e ajude a espalhar a palavra!

----------

Nos vemos na próxima! 🧙