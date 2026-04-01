---
title: "Animating elements when they enter and leave the screen with JavaScript"
date: "2021-01-14T00:00:00.000"
tags: ["JavaScript"]
author: "William Gonçalves"
authorImage: "https://github.com/iwilldotdev.png"
backgroundImage: "javascript"
---

## **How to test if an element is in the viewport?**

There are many ways to do this using JavaScript. This functionality can be useful for animating elements that become visible to the user when they enter the viewport, optimizing the experience and increasing immersion in your application.

In this tutorial, I won't focus on animations themselves because I understand it's a topic that's very particular to both the developer and the project.

The idea is to show a simple and easy-to-implement alternative, so you can capture an element's position and animate it, whether entering or leaving the window.

----------

We start with the basic structure (`index.html`). We'll use a set of 6 random images through an Unsplash API. These images will be animated in two situations: when they "leave" above or below the visible area of the window, the viewport.

```html
<!DOCTYPE html>
<html lang="en">
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

Next, we'll add styles in `style.css` that are just for demonstration, for the `body` and images:

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

Finally, still in the styles, we'll create two classes that will be applied for the two possible viewport exits:

- *.is-down*, which will be applied when the element is below the visible area
- *.is-up*, which will be applied when the element is above the visible area

Remember that the properties used here are just for demonstration purposes. Feel free to create your own transitions to achieve your expected result.

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

## Capture and animate!

In `script.js`, let's start by capturing our list of images using the `querySelectorAll` method, which will return a list of all images that have the `image` class:

```javascript
const images = document.querySelectorAll(".image");
```

----------

Next, we capture the window height. Since we want to animate images leaving above and below the visible area, knowing the viewport height is essential to find out whether an element is within the user's visible area or not:

```javascript
let windowHeight = window.innerHeight;
```

We'll create a function to animate the images. It will use the `forEach` method to loop through the image list and apply the necessary changes.

For each image in the list, we'll create a variable called `bounding` which will be assigned the `DOMRect` object returned from the `getBoundingClientRect()` method.

This object contains the element's dimensions as well as its coordinates relative to the viewport. The following code shows an example of this object's structure. It won't be part of our example.

The property values are in pixels.

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

From these coordinates, which will be assigned to the `bounding` variable, we can determine if an object is within the visible area using the following logic:

Since the page's Y-axis starts at the top, this position equals 0. The bottom of the page will equal the height assigned to the `windowHeight` variable.

If `bounding.bottom`, the image's bottom, is greater than `windowHeight`, the image is not within the viewport but below the visible area, totally or partially.

If `bounding.top`, the image's top, is less than 0, the image is not within the viewport but above the visible area, totally or partially.

From there, we apply the corresponding classes. And if none of the conditions are true, we remove the classes from the image so it has its default appearance, being visible.

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

And since we want this effect to be applied during page scrolling, we add a `listener` that will capture the scroll and execute the `animateImages()` function.

```javascript
document.addEventListener("scroll", function () {
  animateImages();
  document.removeEventListener("scroll", this);
});
```

----------

Additionally, we include a `listener` that will capture window resizing, assigning the new height to the `windowHeight` variable.

```javascript
window.addEventListener("resize", function () {
  windowHeight = window.innerHeight;
  window.removeEventListener("resize", this);
});
```

----------

And to ensure the application already adds classes to images that aren't visible to the user, we execute `animateImages()` as soon as the application starts.

```javascript
animateImages();
```

----------

You can see the demo [here](https://animate-on-scroll.vercel.app)

----------

And as I usually say, this is just the starting point.

You can explore other possibilities with the `DOMRect` from `getBoundingClientRect()`.

Just to leave you with another possible scenario in this example, if you want an element to only go through a transition when it's completely out of the viewport, you can change the conditionals to when `bounding.bottom` (element's bottom) is less than 0 (completely left, above), or `bounding.top` (element's top) is greater than `windowHeight` (completely left, below).

You can also add safe areas so your element stays visible as long as needed. You can apply classes when it's, for example, 10% from the end of the screen, above or below.

Infinite possibilities that will depend on what you intend to do with your elements.

----------

If you enjoyed this content, share it with others and help spread the word!

----------

See you next time!
