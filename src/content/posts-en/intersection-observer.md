---
title: "Intersection Observer - Lazy loading, animations, and infinite scroll without libs"
date: "2022-12-22T00:00:00.000"
tags: ["JavaScript"]
author: "William Gonçalves"
authorImage: "https://github.com/iwilldotdev.png"
backgroundImage: "javascript"
---

What's up, devs!

This post starts a series aimed at exploring the [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API), discovering and presenting functionalities that can be achieved through them.

And considering our habit of using abstractions that bring the same result, we want to empower native options in order to reduce dependencies in projects and deepen our knowledge about the resources available on the Web.

-----

As a _Front-Ender_, I've stumbled upon some challenges to increase page interactivity with _infinite scrollings_ and element animations when they enter and leave the _viewport_, or even performance issues like _lazy-loading_ images, based on user actions.

In cases like this, everything would come down to checking the intersection between a target element and a parent element or even between it and the document's _viewport_ (visible area to the user) and, based on the observed target's state and visibility, apply the necessary changes.

Detecting the visibility of an element (or between two of them) involved not very reliable solutions that tended to cause performance problems on pages, since we needed _handlers_ and _loops_ applied to each affected element and calling methods like `Element.getBoundingClientRect()`, which created a burden on the application's _main thread_, making the page and the browser itself slower.

-----

## Concepts and usage

The **Intersection Observer API** provides a way to asynchronously observe intersection changes. With its implementation, the site no longer needs to handle this responsibility on the _main thread_ and the browser is free to manage observations as it sees fit.

It's possible to declare a _callback_ function that is executed in the following circumstances:

- A target element crosses (totally or partially, according to configuration) with the `root` element.

- The first time the _Observer_ is asked to observe a target element.

This API has full compatibility with all modern browsers, with caveats for **Safari** (Desktop and iOS) and **Firefox for Android** where the `root` element cannot be a document.

-----

## Creating an Intersection Observer

To create an intersection observer you must call its constructor, sending a _callback_ function as the first parameter and an `options` object as the (optional) next parameter:

```js
let options = {
  root: document.querySelector('#rootElement'),
  rootMargin: '0px',
  threshold: 1.0
}

let observer = new IntersectionObserver(callback, options);
```

### Intersection observer options

The `options` object passed to the `IntersectionObserver()` constructor allows you to control the circumstances in which the _callback_ function will be executed:

- `root` - A specified ancestor element or the _viewport_ itself, in the absence of a declared element or if the value is `null`.

- `rootMargin` - Defines the margin limits of the **root** element, increasing or decreasing the delimitation of this element, before computing an intersection. It can have values similar to CSS, like `"10px 20px 30px 40px"` (top, right, bottom, left).

- `threshold` - The _intersection ratio_, which represents the percentage of visibility of the target element relative to the **root**: a value between 0.0 and 1.0. The _callback_ will be executed whenever the target's visibility exceeds the declared value, up or down. It can be declared as:
  - A number. Ex: `0.5`. _Callback_ executed when visibility exceeds 50%.
  - An Array of numbers: Ex: `[0, 0.25, 0.5, 0.75, 1]`. The _callback_ will be executed at each percentage related to the declared values. In this case, every 25% of visibility.

### Declaring an element to be observed

Now that you've created the `observer`, you need to declare an element to be observed by it:

```js
let target = document.querySelector('#targetElement');
observer.observe(target);
```

At this moment, the _callback_ is executed for the first time, even if the target element is not visible.

Whenever the target's visibility exceeds the `threshold` value, the _callback_ is invoked, receiving a list of `IntersectionObserverEntry` objects and the `observer` itself.

Be aware that this _callback_ itself will be executed on the _main thread_. So try not to complicate the logic executed in this scope:

```js
let callback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      /* We check the 'entry' state and make
      the necessary changes if it's visible */  
    }
  });
};
```

Most applications of this _Observer_ can be done by just checking the `isIntersecting` property of the entry, which returns a _boolean_ indicating whether the target element is, or is not, crossing with the `root` element, considering the parameters declared in the `options` object.

To see more properties of the `IntersectionObserverEntry` interface, check the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry).

Assuming we have the necessary foundation to move forward, let's go to the use cases.

-----

## Files used

You can use the [repository](https://github.com/owillgoncalves/intersection-observer) for this article with the final files divided into folders for each case.

-----

## Lazy-loading

Imagine loading all the assets of an entire page and the user not even viewing them, because they decided to navigate to another page. It becomes a waste of resources for them who, in the case of being on a mobile network, consumed data for nothing, and for you who needed to serve files that weren't actually used.

Based on this, let's create a page where images will only be loaded if they are visible.

Starting with the `index.html` file:
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

In the `img` tags, we declare a [_placeholder_](https://owillgoncalves.github.io/intersection-observer/01-lazy-loading/placeholder.png) in the `src` attribute, which will be rendered initially. In the `data-src` attribute, we put the desired image URL. Additionally, we declare the `lazy` class which will be used to select the images.

We season with `style.css`:
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

Now we need to observe the images and, when they are visible, swap the placeholder for the desired URL. In the `script.js` file:

We start by selecting the images.
```js
const images = document.querySelectorAll('.lazy');
```

We create our _Observer_.
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

Inside the _callback_, we use `forEach` on the `entries` and for each `entry` we check if it's crossing the visible area (`entry.isIntersecting`). If positive, we declare the `entry.target` as `image`, replace the `src` with `data-src`, remove the `lazy` class from the image and tell the `observer` to stop observing the image.

Next, we use a `forEach` on the `NodeList` generated with our selector from the beginning, observing each of the images:
```js
images.forEach(image => {
  observer.observe(image);
});
```

Images that have already been viewed have the `src` with the desired URL and those that haven't appeared on screen yet still have the placeholder:

![Print-screen showing two images in the DOM, one with the definitive URL and another with the placeholder](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4olnbv195abbieih2zbv.png)

Opening the Network tab in Dev Tools, you'll see the images being loaded as they appear on screen.

You can check the result [at this link](https://owillgoncalves.github.io/intersection-observer/01-lazy-loading/).

-----

## Scroll animations

This case is interesting for increasing interactivity and immersiveness of the page. When an element becomes visible, we add a CSS class giving the desired effect. We can also remove it if the element is no longer visible, repeating the effect with each new scroll.

We start with `index.html`:
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

The `p` tags will be captured by the _observer_ through the `animate` class.

We add the `style.css`, including the `animate` and `animate--active` classes. The second one will be responsible for the desired effect.
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

In `script.js`, we start by selecting the texts through the `animate` class.
```js
const animatedTexts = document.querySelectorAll('.animate');
```

We create the _observer_ and for each `entry`, we check if it's crossing the screen. If positive, we add the `animate--active` class. Otherwise, we remove this class.
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

Finally, we use `forEach` on the list of texts to add them to the _observer_.
```js
animatedTexts.forEach(text => {
  observer.observe(text);
});
```

The effect will be the text sliding from the left to the center of the `flex-container`.

The result can be seen [at this link](https://owillgoncalves.github.io/intersection-observer/02-animate-on-intersect/).

From this concept, you have the freedom to do whatever you want with any element, whether adding or removing classes, or even using CSS animations, to achieve the desired effect.

-----

## Infinite Scroll

In this case, we'll create a page with infinite scrolling. Whenever we reach the last item in the list, new items will be added, infinitely.

It's a good application for product lists, for example, where the user can simply scroll the page and continue viewing the available items, without needing to navigate or use pagination.

In `index.html` we create a div with the `container` class, where items will be added. Below it, a `p` tag with the text _loading..._ will indicate the end of the list, providing feedback to the user that there's more to be seen.
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

In `style.css`, we include the styles, including those for the images that will be loaded.
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
In `script.js`, we select the container:
```js
const container = document.querySelector('.container');
```

We'll create a function called `getTenRandomImages`, which will return 10 images with random URLs. This function will be responsible for populating the container. In real scenarios, it can be replaced by an API call that returns data to be used in the application, for example.
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

We create the _observer_. In the `callback`, if the observed entry (which will be the last child element of the `container`) is crossing the visible area, the `getTenRandomImages` function will be used to add 10 more images to the `container`, the `entry` will stop being observed and the new last child (`lastElementChild`) of the container will be observed.
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

Finally, we add the initial 10 images to the `container` and declare its last child to be observed, so that new images are only loaded when it's visible.
```js
container.append(...getTenRandomImages());
observer.observe(container.lastElementChild);
```

The result can be seen [here](https://owillgoncalves.github.io/intersection-observer/03-infinite-scroll/).

-----

## Conclusion

The cases presented here can be adapted to real-world contexts without major difficulties.

Considering that the **Intersection Observer API** takes this responsibility of observing target elements off the application's _main thread_, we can scale this solution even in larger applications.

It's also applicable to frameworks like React and Vue, as long as you know how to select elements in the DOMs that are generated by them. It's basically replacing `querySelector` and `querySelectorAll` with the approach of the tool you're using.

-----

Take care and see you next time!

-----

References:

[Intersection Observer API - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
[Intersection Observer | W3C](https://w3c.github.io/IntersectionObserver/#intersection-observer-interface)
