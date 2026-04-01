---
title: "'Magic' text automatically typed with JavaScript"
date: "2020-11-26T00:00:00.000"
tags: ["JavaScript"]
author: "William Gonçalves"
authorImage: "https://github.com/iwilldotdev.png"
backgroundImage: "javascript"
---

> "Blast, heretic! Are you telling me that the writings will appear by themselves? Isn't this sorcery, or witchcraft?"

![Trust me](https://dev-to-uploads.s3.amazonaws.com/i/lppf5cp0b2sejw0rabzr.png)

It's not magic. It's JavaScript. Let's break it down below:

-----

First of all, we need to create, in our HTML, an element to receive the spell, I mean, the created text. It can be a paragraph (**p**) or even a heading (**h1**, **h2**...). It just needs to be a text element and have an **id**. Remember that the **id** needs to be exclusive to that element.

```js
<h1 id="magic-text"></h1>
```

For our case, we'll use an **h1** with the id **magic-text**.

-----

Next, we create and import the JavaScript file which, for our example, will be **script.js**:

```js
<script src="script.js"></script>
```

-----

Now in **script.js**, let's create a constant to interact with our **h1**, using the **querySelector** method, which allows us to select elements using the same selectors we see in CSS.

In our case, we'll use the **id** preceded by **#**.

```js
const magicTextHeader = document.querySelector('#magic-text');
```

The **querySelector** method can be used both on the document and on other elements, after being declared, selecting their respective children.

-----

Next, we create a constant with the text to be used:

```js
const text = 'Text inserted automagically with JavaScript!';
```

-----

Finally, we declare a variable that will help us "traverse" the text:

```js
let indexCharacter = 0;
```

-----

The function that will return the text is **writeText()**:

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

In the first line, we include the text in the **innerText** property of the **h1**, using the **.slice()** method, which will traverse our **text** constant, letter by letter, as if it were an **array**. The **.slice()** syntax is `.slice(a,b)`, where **a** is the initial key of the segment to be returned and **b** is the final key of that same segment. Since we want to return the text from the beginning, we start with key 0 and end with the value of **indexCharacter**, which is incremented in the following line, ensuring that the next execution of the function will return one more character and so on.

Next, we use a conditional to check if **indexCharacter** is equal to the last position of the text (`text.length - 1`; since the first key is 0, the last will be the size (length) of the text minus 1). If the condition is true, **indexCharacter** will be reset to zero, after a **setTimeout** of 2000 milliseconds, making the text start being "typed" from the beginning again.

-----

And to execute this function continuously, ensuring the increment of **indexCharacter** and the desired effect for our text, we use a **setInterval** that will execute the **writeText** function every 100 milliseconds:

```js
setInterval(writeText, 100);
```

-----

And the magic is complete!

-----

You can see an example [here](https://g31-magic-text.vercel.app/).
And check out my version of the code [here](https://github.com/williammago/goodbye.31/tree/main/28%20-%20Auto%20Write%20Text%20com%20JavaScript).

-----

And, optionally, use the styles I used there:

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

This article was inspired by a [video](https://www.youtube.com/watch?v=8GPPJpiLqHk) from [Florin Pop's channel](https://www.youtube.com/channel/UCeU-1X402kT-JlLdAitxSMA), which has amazing tutorials and challenges for those who are starting out. Content in English.

-----

See you next time! Big hug!
