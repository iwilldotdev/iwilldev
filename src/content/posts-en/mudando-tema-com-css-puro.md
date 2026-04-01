---
title: "Changing screen theme with Pure CSS (Dark/Light Mode)"
date: "2021-01-03T00:00:00.000"
tags: ["CSS"]
author: "William Gonçalves"
authorImage: "https://github.com/iwilldotdev.png"
backgroundImage: "css"
---

## *We know the JS way*

### *But what if we don't use scripts to switch the theme of our applications?*

The path is a relationship between cascade and well-specified selectors.

Let's start from the beginning:

----------

#### HTML

The first element of the tree will be a checkbox input.

Its sibling below will be the container of our application. It's the one that will have the styles changed for the theme switch.

Inside it, we'll have a label related to our input above, inside a div that will be its transition area, serving as our button to change the theme.

```html
<body>
  <input type="checkbox" id="theme-switcher">
  <div id="app-container">
    <div class="theme-switcher-area">
      <label for="theme-switcher" class="theme-switcher-button">
      </label>
    </div>
    <h1>Changing theme with Pure CSS</h1>
    <p>The text contrasts 
    with the background</p>
  </div>
</body>
```

----------

#### CSS

In the styles, we apply the resets and declare the variables for the colors used in the theme:

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

We make our input invisible, since we'll use its label as the trigger.

```css
#theme-switcher {
  display: none;
}
```

----------

And we declare the properties of our app container. It will occupy the entire screen, have a light background and dark texts, as well as being a flex-container. The latter is optional and just to facilitate the demonstration of the result, centering the text on the screen.

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

We declare the area where our button will slide, with absolute positioning at the top:

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

The button itself, which will use the `dashed` border style, creating an effect similar to sun rays, for the light theme.

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

And finally, an `::after` pseudo-element over the button. It will have the shape of a smaller circle than the original element, becoming a shadow that will transform the trigger into a moon, in the dark theme. Therefore, its initial opacity will be 0.

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

## And here comes the magic!

Since our input is the first element of the tree, we can use the ':checked' pseudo-class, with the appropriate selectors, to change the style of any element below it.

When it's selected, these properties will be applied.

Starting with the trigger itself, transforming the sun into a moon. To do this, we remove the border that came to give the rays effect and move the button to the right.

```css
#theme-switcher:checked + #app-container .theme-switcher-button {
    transform: translateX(100%);
    border: none;
}
```

----------

Next, we change the shadow's opacity, the `::after`, to generate a crescent moon, in the button change.

```css
#theme-switcher:checked + #app-container .theme-switcher-button::after {
    opacity: 1;
}
```

----------

Finally and for the desired effect, we invert the background color and text of our app container:

```css
#theme-switcher:checked + #app-container {
    background: var(--dark);
    color: var(--light);
}
```

----------

### And there it is, where the owl sleeps!

![Theme change demonstration using only CSS](https://dev-to-uploads.s3.amazonaws.com/i/9q8ffcms8zgj2gqccihs.gif)

----------

This tutorial is just the beginning of the dive. So use your creativity from this base and change the styles as you see fit!

----------

If you enjoyed this content, share it with others and help spread the word!

----------

See you next time! 🧙
