---
title: "Animando elementos quando saem e entram na tela com JavaScript"
date: "2021-01-14T00:00:00.000"
tags: ["JavaScript"]
author: "William Gonçalves"
authorImage: "https://github.com/iwilldotdev.png"
backgroundImage: "javascript"
---

## **Como testar se um elemento está no viewport?**

Existem muitas formas de se fazer isso, utilizando JavaScript. Essa funcionalidade pode ser útil para animar elementos que se tornam visíveis para o usuário, quando entram no viewport, otimizando a experiência e aumentando a imersão da sua aplicação.

Nesse tutorial, não vou focar na questão das animações, porque entendo que é um tópico muito particular, tanto do desenvolvedor, como do projeto.

A ideia é mostrar uma alternativa simples e fácil de ser implementada, para que você consiga capturar a posição de um elemento e animá-lo, seja na entrada ou na saída da janela.

----------

Começamos pela estrutura básica (`index.html`). Utilizaremos um conjunto de 6 imagens aleatórias, através de uma API do Unsplash. Essas imagens serão animadas em duas situações: quando "saírem" para cima ou para baixo da área visível da janela, do viewport.

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <title>Document</title>
</head>
<body>
  <img src="https://source.unsplash.com/random" class="image" alt="">
  <img src="https://source.unsplash.com/random" class="image" alt="">
  <img src="https://source.unsplash.com/random" class="image" alt="">
  <img src="https://source.unsplash.com/random" class="image" alt="">
  <img src="https://source.unsplash.com/random" class="image" alt="">
  <img src="https://source.unsplash.com/random" class="image" alt="">
  <script src="script.js"></script>
</body>
</html>
```

----------

Em seguida, adicionaremos estilos no `style.css` que são apenas demonstrativos, para o `body` e as imagens:

```css
body {
  padding: 10rem 5rem;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10rem;

  background: #121212;
  overflow-x: hidden;
}

img {
  width: 100%;
  max-width: 600px;
  height: 400px;
  object-fit: cover;
  
  transition: 0.5s;
}
```

----------

Por último, ainda nos estilos, criaremos duas classes que serão aplicadas nas duas saídas possíveis do viewport:

- *.is-down*, que será aplicada quando o elemento estiver abaixo da área visível
- *.is-up*, que será aplicada quando o elemento estiver acima da área visível

Lembrando que as propriedades utilizadas aqui são apenas para efeito de demonstração. Sinta-se a vontade para criar suas próprias transições, dentro do resultado esperado.

```css
.is-down {
  transform: translateX(25%);
  opacity: 0;
}

.is-up {
  transform: translateX(-25%);
  opacity: 0;
}
```

----------

## Capture e anime!

Já no `script.js`, vamos começar capturando nossa lista de imagens, utilizando o método `querySelectorAll`, que vai retornar uma lista com todas as imagens que têm a classe `image`:

```javascript
const images = document.querySelectorAll(".image");
```

----------

Em seguida, capturamos a altura da janela. Como queremos animar as imagens saindo acima e abaixo da área visível, saber a altura do viewport é fundamental para descobrir se um elemento está, ou não, na área visível para o usuário:

```javascript
let windowHeight = window.innerHeight;
```

Criaremos uma função para animar as imagens. Ela vai utilizar o método `forEach` para percorrer a lista de imagens e aplicar as alterações necessárias.

Para cada imagem da lista, vamos criar uma variável chamada `bounding` a qual será atribuída o objeto `DOMRect`, retornado do método `getBoundingClientRect()`.

Esse objeto conta com as dimensões do elemento, bem como com suas coordenadas em relação ao viewport. O código a seguir mostra um exemplo da estrutura desse objeto. Ele não fará parte do nosso exemplo. 

Os valores das propriedades estão em pixels.

```javascript
{
  bottom: -413.316650390625,
​  height: 400,
​  left: 491.5,
​  right: 1091.5,
​  top: -813.316650390625,
  width: 600,
​  x: 491.5,
​  y: -813.316650390625
}
```

----------

A partir dessas coordenadas, que serão atribuídas a variável `bounding`, podemos definir se um objeto está dentro da área visível, partindo do seguinte raciocínio:

Como o eixo Y da página começa no topo, essa posição é igual a 0. A base da página será igual a altura que foi atribuída a variável `windowHeight`. 

Se `bounding.bottom`, a base da imagem, for maior que `windowHeight`, a imagem não está dentro do viewport, mas abaixo da área visível, total ou parcialmente.

Se `bounding.top`, o topo da imagem, for menor que 0, a imagem não está dentro do viewport, mas acima da área visível, total ou parcialmente.

A partir daí, aplicamos as classes correspondentes. E caso nenhuma das lógicas seja verdadeira, removemos as classes da imagem, para que ela tenha sua aparência padrão, estando visível.

```javascript
function animateImages() {
  images.forEach((image) => {
    let bounding = image.getBoundingClientRect();
    if (bounding.bottom > windowHeight) {
      image.classList.add("is-down");
    } else if (bounding.top < 0) {
      image.classList.add("is-up");
    } else {
      image.classList.remove("is-up");
      image.classList.remove("is-down");
    }
  });
}
```

----------

E como queremos que esse efeito seja aplicado durante a rolagem da página, adicionamos um `listener` que vai capturar o scroll e executar a função `animateImages()`.

```javascript
document.addEventListener("scroll", function () {
  animateImages();
  document.removeEventListener("scroll", this);
});
```

----------

Além disso, incluímos um `listener` que vai capturar o redimensionamento da janela, atribuindo a nova altura a variável `windowHeight`.

```javascript
window.addEventListener("resize", function () {
  windowHeight = window.innerHeight;
  window.removeEventListener("resize", this);
});
```

----------

E para que a aplicação já adicione as classes as imagens que não estão visíveis para o usuário, executamos a `animateImages()`, assim que a aplicação é iniciada.

```javascript
animateImages();
```

----------

Você pode ver a demonstração [aqui](https://animate-on-scroll.vercel.app)

----------

E como costumo dizer, aqui é só o ponto de partida.

Você pode explorar outras possibilidades, com o `DOMRect` do `getBoundingClientRect()`. 

Só pra deixar um outro cenário possível nesse exemplo, se você quiser que um elemento só passe por uma transição quando ele estiver totalmente fora do viewport, você pode mudar as condicionais para quando o `bounding.bottom` (base do elemento) for menor que 0 (saiu totalmente, acima), ou o `bounding.top` (topo do elemento) for maior que `windowHeight` (saiu totalmente, abaixo).

Você ainda pode adicionar áreas seguras para que seu elemento continue visível enquanto necessário. Pode aplicar as classes quando ele estiver a, por exemplo, 10% do fim da tela, acima ou abaixo.

Possibilidades infinitas que vão depender do que você pretende fazer com seus elementos.

----------

Se você curtiu esse conteúdo, compartilhe com outras pessoas e ajude a espalhar a palavra!

----------

Nos vemos na próxima!