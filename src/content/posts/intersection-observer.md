---
title: "Intersection Observer - Lazy loading, animações e scroll infinito sem libs"
date: "2022-12-22T00:00:00.000"
tags: ["JavaScript"]
author: "William Gonçalves"
authorImage: "https://github.com/iwilldotdev.png"
backgroundImage: "javascript"
---

Salve, devs e divas!

Esse post inicia uma série que visa explorar as [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API), descobrindo e apresentando funcionalidades que podem ser alcançadas a partir delas.

E considerando o costume de utilizarmos abstrações que trazem o mesmo resultado, queremos empoderar as opções nativas a fim de reduzir dependências em projetos e aprofundar os conhecimentos sobre os recursos disponíveis na Web.

-----

Como _Front-Ender_, já esbarrei em alguns desafios para aumentar a interatividade da página com _infinite scrollings_ e animações de elementos quando eles entram e saem do _viewport_, ou até mesmo questões que impactam performance como _lazy-loading_ em imagens, a partir das ações do usuário.

Em casos como esse, tudo se resumiria a verificar a intersecção entre um elemento alvo e um elemento pai ou até mesmo entre ele e o _viewport_ (área visível para o usuário) do documento e, a partir do estado e da visibilidade do alvo observado, aplicar as mudanças necessárias.

Detectar a visibilidade de um elemento (ou entre dois deles) envolvia soluções não muito confiáveis e que tendiam a gerar problemas de performance nas páginas, já que precisávamos de _handlers_ e _loops_ aplicados a cada elemento afetado e chamando métodos como o `Element.getBoundingClientRect()`, o que gerava um peso na _main thread_ da aplicação, deixando a página e o próprio navegador mais lentos.

-----

## Conceitos e uso

A **Intersection Observer API** fornece uma maneira de observar alterações de intersecção de forma assíncrona. Com sua implementação, o site não precisa mais lidar com essa responsabilidade na _main thread_ e o navegador fica livre para gerenciar as observações como achar melhor.

É possível declarar uma função de _callback_ que é executada nas seguintes circunstâncias: 

- Um elemento alvo cruza (total ou parcialmente, conforme configuração) com o elemento `root`.

- A primeira vez que o _Observer_ é solicitado a observar um elemento alvo.

Essa API tem compatibilidade total com todos os navegadores modernos, com ressalvas para o **Safari** (Desktop e iOS) e o **Firefox for Android** onde o elemento `root` não pode ser um documento.

-----

## Criando um Intersection Observer

Para criar um intersection observer você deve chamar seu construtor, enviando uma função de _callback_ como primeiro parâmetro e um objeto `options` como parâmetro (opcional) seguinte: 

```js
let options = {
  root: document.querySelector('#rootElement'),
  rootMargin: '0px',
  threshold: 1.0
}

let observer = new IntersectionObserver(callback, options);
```

### Intersection observer options 

O objeto `options` passado no construtor `IntersectionObserver()` te permite controlar as circunstâncias em que a função de _callback_ será executada:

- `root` - Um elemento ancestral especificado ou o próprio _viewport_, na ausência de elemento declarado ou se o valor for `null`.

- `rootMargin` - Define os limites de margem do elemento **root**, aumentando ou diminuindo a delimitação desse elemento, antes de computar uma intersecção. Pode ter valores similares ao CSS, como `"10px 20px 30px 40px"` (top, right, bottom, left).

- `threshold` - A taxa de interseção (_intersection ratio_), que representa o percentual de visibilidade do elemento alvo em relação ao **root**: um valor entre 0,0 e 1,0. O _callback_ será executado sempre que a visibilidade do alvo ultrapassar o valor declarado, para cima ou para baixo. Pode ser declarado como:
  - Um número. Ex: `0.5`. _Callback_ executado quando a visibilidade ultrapassar 50%.
  - Um Array de números: Ex: `[0, 0.25, 0.5, 0.75, 1]`. O _callback_ será executado em cada percentual relacionado aos valores declarados. Nesse caso, a cada 25% de visibilidade.

### Declarando um elemento para ser observado

Agora que criou o `observer`, você precisa declarar um elemento a ser observado por ele:

```js
let target = document.querySelector('#targetElement');
observer.observe(target);
```

Nesse momento, o _callback_ é executado pela primeira vez, mesmo que o elemento alvo não esteja visível.

Sempre que a visibilidade do alvo ultrapassar o valor de `threshold`, o _callback_ é invocado, recebendo uma lista de objetos `IntersectionObserverEntry` e o próprio `observer`.

Esteja ciente de que esse _callback_, em si, será executado na _main thread_. Então tente não complicar a lógica executada nesse escopo:

```js
let callback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      /* Verificamos o estado da 'entry' e efetuamos
      as alterações necessárias caso ela esteja visível */  
    }
  });
};
```

Boa parte das aplicações desse _Observer_ podem ser feitas verificando apenas a propriedade `isIntersecting` da entry, que retorna um _boolean_ indicando se o elemento alvo está, ou não, cruzando com o elemento `root`, considerando os parâmetros declarados no objeto `options`.

Para ver mais propriedades da interface `IntersectionObserverEntry`, confira a [documentação na MDN](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry).

Partindo do princípio que temos a base necessária para avançar, vamos aos casos de uso.

-----

## Arquivos utilizados

Você pode usar o [repositório](https://github.com/owillgoncalves/intersection-observer) desse artigo com os arquivos finais divididos em pastas para cada caso.

-----

## Lazy-loading

Imagine carregar todos os assets de uma página inteira e o usuário nem visualizá-los, porque decidiu desviar a navegação para outra página. Vira um desperdício de recurso para ele que no caso de estar em uma rede móvel, consumiu dados à toa e para você que precisou servir arquivos que não foram utilizados de fato.

Partindo disso, vamos criar uma página em que as imagens só serão carregadas se estiverem visíveis.

Começando pelo arquivo `index.html`:
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <title>Lazy Loading</title>
</head>

<body>
  <section>
    <img class="lazy" src="placeholder.png" data-src="https://picsum.photos/300/200" />
  </section>
  <section>
    <img class="lazy" src="placeholder.png" data-src="https://picsum.photos/300/201" />
  </section>
  <section>
    <img class="lazy" src="placeholder.png" data-src="https://picsum.photos/300/202" />
  </section>
  <section>
    <img class="lazy" src="placeholder.png" data-src="https://picsum.photos/300/203" />
  </section>
  <script src="script.js"></script>
</body>

</html>
```

Nas tags `img`, declaramos um [_placeholder_](https://owillgoncalves.github.io/intersection-observer/01-lazy-loading/placeholder.png) no atributo `src`, que será renderizado inicialmente. No atributo `data-src`, colocamos a URL da imagem desejada. Além disso, declaramos a classe `lazy` que será usada para selecionarmos as imagens.

Temperamos com o `style.css`:
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

body {
  font-family: "Roboto", sans-serif;
  background-color: #f5f5f5;
}

section {
  height: 100%;
  width: 100%;
  align-items: center;
  display: flex;
  justify-content: center;
}
```

Agora precisamos observar as imagens e, quando elas estiverem visíveis, trocar o placeholder para a URL desejada. No arquivo `script.js`:

Começamos selecionando as imagens.
```js
const images = document.querySelectorAll('.lazy');
```

Criamos nosso _Observer_.
```js
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const image = entry.target;
      image.src = image.dataset.src;
      image.classList.remove('lazy');
      observer.unobserve(image);
    }
  });
});
```

Dentro do _callback_, usamos o `forEach` nas `entries` e para cada `entry` verificamos se ela está cruzando a área visível (`entry.isIntersecting`). Se positivo, declaramos o `entry.target` como `image`, substituímos o `src` pelo `data-src`, removemos a classe `lazy` da imagem e mandamos o `observer` deixar de observar a imagem.

Em seguida, utilizamos um `forEach` na `NodeList` gerada com nosso seletor do início, observando cada uma das imagens:
```js
images.forEach(image => {
  observer.observe(image);
});
```

As imagens que já foram visualizadas têm o `src` com a URL desejada e as que ainda não apareceram na tela, seguem com o placeholder:

![Print-screen mostrando duas imagens no DOM, uma com a URL definitiva e outra com o placeholder](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4olnbv195abbieih2zbv.png)

Abrindo a aba Rede/Network no Dev Tools, você verá as imagens sendo carregadas conforme aparecem na tela.

Você pode conferir o resultado [nesse link](https://owillgoncalves.github.io/intersection-observer/01-lazy-loading/). 

-----

## Animações em scroll

Esse caso é interessante para aumentar a interatividade e imersividade da página. Quando um elemento se torna visível, adicionamos uma classe CSS dando o efeito desejado. Podemos ainda removê-la, caso o elemento não esteja mais visível, repetindo o efeito a cada novo scroll.

Começamos com o `index.html`:
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <title>Lazy Loading</title>
</head>

<body>
  <section>
    <p class="animate">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, impedit explicabo sunt omnis veritatis quia
      soluta alias sed animi earum error recusandae maxime, at reiciendis amet magnam perspiciatis iure dolorem.
    </p>
  </section>
  <section>
    <p class="animate">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, impedit explicabo sunt omnis veritatis quia
      soluta alias sed animi earum error recusandae maxime, at reiciendis amet magnam perspiciatis iure dolorem.
    </p>
  </section>
  <section>
    <p class="animate">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, impedit explicabo sunt omnis veritatis quia
      soluta alias sed animi earum error recusandae maxime, at reiciendis amet magnam perspiciatis iure dolorem.
    </p>
  </section>
  <section>
    <p class="animate">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, impedit explicabo sunt omnis veritatis quia
      soluta alias sed animi earum error recusandae maxime, at reiciendis amet magnam perspiciatis iure dolorem.
    </p>
  </section>
  <script src="script.js"></script>
</body>

</html>
```

As tags `p` serão capturadas pelo _observer_ através da classe `animate`.

Adicionamos o `style.css`, incluindo as classes `animate` e `animate--active`. Essa segunda será responsável pelo efeito desejado.
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

body {
  font-family: "Roboto", sans-serif;
  background-color: #f5f5f5;
}

section {
  height: 100%;
  width: 100%;
  padding: 20px;
  align-items: center;
  display: flex;
  justify-content: center;
}

.animate {
  width: 300px;
  opacity: 0;
  transform: translateX(-100px);
  transition: all 0.5s ease-in-out;
}

.animate--active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.5s ease-in-out;
}
```

No `script.js`, começamos selecionando os textos através da classe `animate`.
```js
const animatedTexts = document.querySelectorAll('.animate');
```

Criamos o _observer_ e para cada `entry`, verificamos se ela está cruzando a tela. Se positivo, adicionamos a classe `animate--active`. Caso contrário, removemos essa classe.
```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate--active');
    } else {
      entry.target.classList.remove('animate--active');
    }
  });
});
```

Por fim, usamos o `forEach` na lista de textos, para adicioná-los ao _observer_.
```js
animatedTexts.forEach(text => {
  observer.observe(text);
});
```

O efeito será o texto deslizando a partir da esquerda, até o centro do `flex-container`.

O resultado pode ser visto [nesse link](https://owillgoncalves.github.io/intersection-observer/02-animate-on-intersect/).

A partir desse conceito, você tem a liberdade de fazer o que quiser com qualquer elemento, seja adicionando ou removendo classes, ou até usando animações CSS, para chegar ao efeito desejado.

-----

## Scroll Infinito

Nesse caso, vamos criar uma página com rolagem infinita. Sempre que chegarmos ao último item da lista, novos itens serão adicionados, infinitamente.

É uma aplicação boa para lista de produtos, por exemplo, em que o usuário pode simplesmente rolar a página e continuar visualizando os itens disponíveis, sem precisar navegar ou usar paginação.

No `index.html` criamos uma div com a classe `container`, onde os itens serão adicionados. Abaixo dela, uma tag `p` com o texto _loading..._ vai indicar o fim da lista, trazendo um retorno para o usuário de que há mais para ser visto.
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <title>Document</title>
</head>

<body>
  <main>
    <div class="container"></div>
    <p>loading...</p>
  </main>
  <script src="script.js"></script>
</body>

</html>
```

No `style.css`, incluímos os estilos, incluindo os das imagens que serão carregadas.
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

body {
  font-family: "Roboto", sans-serif;
  background-color: #f5f5f5;
}

.container {
  height: 100%;
  width: 100%;
  margin: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
}

img {
  width: 320px;
  height: 320px;
  object-fit: cover;
}
```
No `script.js`, selecionamos o container:
```js
const container = document.querySelector('.container');
```

Vamos criar uma função chamada `getTenRandomImages`, que vai retornar 10 imagens, com URLs aleatórias. Essa função será responsável por popular o container. Em cenários reais, ela pode ser substituída por uma chamada a uma API que retorna dados a serem usados no aplicativo, por exemplo.
```js
const getTenRandomImages = () => {
  const images = [];
  for (let i = 0; i < 10; i++) {
    const image = document.createElement('img');
    image.src = `https://picsum.photos/300/300?random=${Math.random()}`;
    images.push(image);
  }
  return images;
};
```

Criamos o _observer_. No `callback`, se a entry observada (que será o último elemento filho do `container`) estiver cruzando a área visível, a função `getTenRandomImages` será usada para adicionar mais 10 imagens no `container`, a `entry` deixará de ser observada e o novo último filho (`lastElementChild`) do container passará a ser observado.
```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      container.append(...getTenRandomImages());
      observer.unobserve(entry.target);
      observer.observe(container.lastElementChild);
    }
  });
});
```

Por fim, adicionamos as 10 imagens iniciais no `container` e declaramos o último filho dele para ser observado, para que as novas imagens só sejam carregadas quando ele estiver visível.
```js
container.append(...getTenRandomImages());
observer.observe(container.lastElementChild);
```

O resultado pode ser visto [aqui](https://owillgoncalves.github.io/intersection-observer/03-infinite-scroll/).

-----

## Conclusão

Os casos apresentados aqui podem ser adaptados a contextos do mundo real, sem maiores dificuldades. 

Considerando que a **Intersection Observer API** tira da _main thread_ da aplicação essa responsabilidade de observar os elementos alvos, conseguimos escalar essa solução mesmo em aplicações com porte maior.

Ela também é aplicável a frameworks como React e Vue, desde que você saiba como selecionar os elementos nos DOMs que são gerados por eles. É basicamente substituir o `querySelector` e o `querySelectorAll` pela abordagem da ferramenta que você utiliza.

-----

Um grande abraço e até a próxima!

-----

Referências: 

[Intersection Observer API - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
[Intersection Observer | W3C](https://w3c.github.io/IntersectionObserver/#intersection-observer-interface)