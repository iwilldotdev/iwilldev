---
title: "Texto 'mágico' escrito automaticamente com JavaScript"
date: "2020-11-26T00:00:00.000"
tags: ["JavaScript"]
author: "William Gonçalves"
authorImage: "https://github.com/iwilldotdev.png"
backgroundImage: "javascript"
---

> “Raios, herege! Estás a me dizer que os escritos surgirão sozinhos? Isso não é feitiço, ou bruxaria?”

![Confia](https://dev-to-uploads.s3.amazonaws.com/i/lppf5cp0b2sejw0rabzr.png)

Não é mágica. É JavaScript. Vamos desenrolar isso abaixo:

-----

Antes de tudo, precisamos criar, no nosso HTML, um elemento para receber o feitiço, digo, o texto criado. Pode ser um parágrafo (**p**) ou até um cabeçalho (**h1**, **h2**...). Basta ser de texto e ter um **id**. Lembrando que o **id** precisa ser exclusivo desse elemento.

```js
<h1 id="magic-text"></h1>
```

Pro nosso caso, vamos usar um **h1** com a id **magic-text**.

-----

Em seguida, criamos e importamos o arquivo JavaScript que, pro nosso exemplo, será o **script.js**:

```js
<script src="script.js"></script>
```

-----

Já no **script.js**, vamos criar uma constante para interagir com nosso **h1**, usando o método **querySelector**, que nos permite selecionar elementos usando os mesmos seletores que vemos no CSS. 

No nosso caso, vamos usar a **id** precedida pelo **#**.

```js
const magicTextHeader = document.querySelector('#magic-text');
```

O método **querySelector** pode ser usado, tanto no documento, como em outros elementos, após declarados, selecionando seus respectivos filhos.

-----

Em seguida, criamos uma constante com o texto a ser usado:

```js
const text = 'Texto inserido automagicamente com JavaScript!';
```

-----

Por fim, declaramos uma variável que servirá para nos ajudar a "percorrer" o texto:

```js
let indexCharacter = 0;
```

-----

A função que retornará o texto é a **writeText()**:

```js
function writeText() {
  magicTextHeader.innerText = text.slice(0, indexCharacter);
  indexCharacter++;
  if(indexCharacter > text.length - 1) {
    setTimeout(() => {
      indexCharacter = 0;  
    }, 2000);
  }
}
```

Na primeira linha, incluímos o texto na propriedade **innerText** do **h1**, utilizando o método **.slice()**, que percorrerá nossa constante **text**, letra a letra, como se ela fosse um **array**. A sintaxe do **.slice()** é `.slice(a,b)`, onde **a** é a chave inicial do trecho a ser retornado e **b** é a chave final desse mesmo trecho. Como queremos retornar o texto desde o início, começamos com a chave 0 e finalizamos com o valor da **indexCharacter**, que é incrementada na linha seguinte, garantindo que a próxima execução da função retornará um caractere a mais e assim por diante. 

Em seguida, usamos uma condicional para verificar se a **indexCharacter** é igual a última posição do texto (`text.length - 1`; como a primeira chave é 0, a última será o tamanho (length) do texto menos 1). Se a condição for verdadeira, a **indexCharacter** será zerada, depois de um **setTimeout** de 2000 milissegundos, fazendo com que o texto volte a ser "digitado" do início.

-----

E para executar essa função de forma contínua, garantindo o incremento da **indexCharacter** e o efeito desejado para nosso texto, usamos um **setInterval** que executará a função **writeText** a cada 100 milissegundos:

```js
setInterval(writeText, 100);
```

-----

E a mágica está concluída!

-----

Você pode ver um exemplo [aqui](https://g31-magic-text.vercel.app/).
E conferir minha versão do código [aqui](https://github.com/williammago/goodbye.31/tree/main/28%20-%20Auto%20Write%20Text%20com%20JavaScript).

-----

E, opcionalmente, usar os estilos que usei lá:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;

  background: darkred;
  color: #FFF;
}

h1 {
  font-size: 2rem;
  max-width: 400px;
  text-align: center;
}
```

-----

Esse artigo foi inspirado em um [vídeo](https://www.youtube.com/watch?v=8GPPJpiLqHk) do [canal](https://www.youtube.com/channel/UCeU-1X402kT-JlLdAitxSMA) do Florin Pop, que tem tutoriais e desafios incríveis pra quem está iniciando. Conteúdo em inglês.

-----

Nos vemos na próxima! Grande abraço!