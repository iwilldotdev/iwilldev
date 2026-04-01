---
title: "TypeScript Fundamentals\nwith Cars"
description: "Teaching TypeScript to my autistic son (pt 1)"
date: "2025-06-19T00:00:00.000"
tags: ["TypeScript"]
author: "William Gonçalves"
authorImage: "https://github.com/iwilldotdev.png"
backgroundImage: "pedro"
---

![pedro-no-carrinho](https://github.com/user-attachments/assets/15c26a2b-0b27-4eea-a337-e1ed3e9436b8)

### Pedro is an autistic boy, now 8 years old.

He told me he wants to learn programming to work with daddy, and I decided to start this series in his honor.

He has some hyperfocuses, but the main one is cars. So that will be the theme of this series, explaining TypeScript fundamentals and concepts applied to cars and their features.

Starting with primitive and special types:

## number

It's the type of information returned from dashboard instruments, like the speedometer.

It will always be numbers and nothing else.

If missing, we can't see how fast the car is going.

```ts
function readSpeed(): number {}
// 80
function readTotalMileage(): number {}
// 230000
```

## string

It's information that contains letters and numbers.

It can be the car's license plate, or even its make and model.

If missing, nobody knows which car it is.

```ts
function readLicensePlate(): string {}
// 'ABC-1Z34'
function readMakeAndModel(): string {}
// 'Chevrolet Classic'
```

## boolean 

It's simple information, true or false.

It serves, for example, to know if a part of the car is working or not.

If missing, we don't know if the car works.

```ts
function isEngineRunning(): boolean {}
// true | false
```

## null

It's like the luggage in the trunk before a trip.

It's not there yet, but we'll put it there later.

If missing, we might forget something important.

```ts
let luggage: string | null = null;
```

## undefined

It's information that nobody decided what it is.

Like an empty space in the car console, which could be used to install something.

It's missed if we decide to use it and there's nothing there.

```ts
let consoleAccessory;
/* We don't know what it is because nothing was assigned to the space */
```

## symbol

Stores things with the same name, without confusion.

You want to put stickers on your car, but they should go in different places. Some even a bit hidden. But you know where you put them and can find them whenever you want.

```ts
const sticker1 = Symbol("sticker");
const sticker2 = Symbol("sticker");

const car = {
  sticker: "sticker on hood",
  [sticker1]: "sticker under seat",
  [sticker2]: "sticker on wheel arch"
}

console.log(Object.values(car))
// sticker locations: ['sticker on hood']

console.log(car[sticker1])
// 'sticker under seat'

console.log(car[sticker2])
// 'sticker on wheel arch'
```

## any

It's the crazy junk drawer.

It can store anything: lunchbox, tool, ball, tire, rock, paper, scissors...

It's bad, because we never know what's in there.

```ts
let junkDrawer: any = "broom";
junkDrawer = 22;
junkDrawer = null;
junkDrawer = false;
```

## unknown

It's like the car's glove compartment.

There's something in there, but you need to check what it is.

Safer than `any`, because you just don't know what it is. After checking, you can use it freely.

```ts
let gloveboxItem: unknown = "car manual";

function readManual(manual: string) { /* ... */ }

if (typeof gloveboxItem === "string") {
  readManual(gloveboxItem)
}
```

## never

Appears when something breaks or gets out of control.

Like when the car engine doesn't work.

We normally don't use it, but we can apply it when we know something will go wrong.

```ts
function startBrokenEngine(): never {
  throw new Error("Kaboom!");
}
```

## void

Like opening the car door, the trunk, or even the glove compartment.

It's used in actions that are necessary to use the car, but don't return any information.

```ts
function openCarDoor(): void {}
```

-----

What else do you want to learn about TypeScript with cars?

This series will continue soon...

-----

Like, share, and follow me on [social media](https://www.iwill.dev/links) for more content.
