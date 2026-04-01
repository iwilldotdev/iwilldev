---
title: "Fundamentos \nTypeScript com carros"
description: "Ensinando TypeScript para o meu filho autista (pt 1)"
date: "2025-06-19T00:00:00.000"
tags: ["TypeScript"]
author: "William Gonçalves"
authorImage: "https://github.com/iwilldotdev.png"
backgroundImage: "pedro"
---

![pedro-no-carrinho](https://github.com/user-attachments/assets/15c26a2b-0b27-4eea-a337-e1ed3e9436b8)

### Pedro é um menino autista, hoje com 8 anos.

Ele me disse que quer aprender a programar pra trabalhar com o papai e eu decidi iniciar essa série em homenagem a ele.

Ele tem alguns hiperfocos, mas o principal é com carros. Então esse será o tema dessa série, explicando fundamentos e conceitos TypeScript aplicados aos carros e suas funcionalidades.

Começando pelos tipos primitivos e especiais:

## number

É o tipo de informação que retorna dos instrumentos do painel, como o velocímetro.

Sempre serão números e nada além disso.

Se faltar, não vemos quão rápido o carro vai.

```ts
function lervelocidade(): number {}
// 80
function lerQuilometragemTotal(): number {}
// 230000
```

## string

São informações que têm letras e números.

Podem ser a placa do carro, ou até mesmo a marca e modelo dele

Se faltar, ninguém sabe qual é o carro.

```ts
function lerPlacaDoCarro(): string {}
// ABC-1Z34'
function lerMarcaEModelo(): string {}
// 'Chevrolet Classic'
```

## boolean 

São informações simples, de verdadeiro ou falso.

Servem, por exemplo, pra saber se uma parte do carro está, ou não, funcionando.

Se faltar, não sabemos se o carro funciona.

```ts
function motorEstaLigado(): boolean {}
// true | false
```

## null

É como a bagagem no porta-malas antes de uma viagem.

Ela ainda não está lá, mas vamos colocar depois.

Se faltar, podemos esquecer algo importante.

```ts
let bagagem: string | null = null;
```

## undefined

É uma informação que ninguém decidiu o que é.

Como um espaço vazio no console do carro, que pode servir para instalar alguma coisa

Faz falta se decidirmos usar e não houver nada lá.

```ts
let acessorioDoConsole;
/* Não sabemos o que é porque nada foi atrbuído ao espaço */
```

## symbol

Guarda coisas com mesmo nome, sem confusão.

Você quer instalar adesivos no seu carro, mas eles devem ficar em lugares diferentes. Alguns até meio que escondidos. Mas você sabe onde colocou e pode achar quando quiser.

```ts
const adesivo1 = Symbol("adesivo");
const adesivo2 = Symbol("adesivo");

const carro = {
  adesivo: "adesivo no capô",
  [adesivo1] "adesivo embaixo do banco",
  [adesivo2]: "adesivo na caixa de roda"
}

console.log(Object.values(carro))
// locais dos adesivos: ['adesivo no capô']

console.log(carro[adesivo1])
// 'adesivo embaixo do banco'

console.lng(carro[adesivo2])
// 'adesivo na caixa de roda'
```

## any

É o porta-trecos maluco.

Pode guardar qualquer coisa: lancheira, ferramenta, bola, pneu, pedra, papel, tesoura...

É ruim, porque a gente nunca sabe o que tem lá

```ts
let portaTrecos: any = "vassoura";
portaTrecos = 22;
portaTrecos = null;
portaTrecos = false;
```

## unknown

É como o porta-luvas do carro.

Tem algo ali dentro, mas você precisa ver o que é.

Mais seguro que o `any`, porque você só não sabe o que é. Depois de conferir, pode usar de boa.

```ts
let objetoNoPortaluvas: unknown = "manual do carro";

function lerManual(manual: string) { /* ... */ }

if (typeof objetoNoPortaluvas === "string") {
  lerManual(objetoNoPortaluvas)
}
```

## never

Aparece quando algo quebra, ou sai do controle

Como quando o motor do carro não funciona.

A gente normalmente não usa ele, mas dá pra aplicar quando sabemos que algo vai dar errado.

```ts
function ligarMotorQuebrado(): never {
  throw new Error("Kaboom!");
}
```

## void

Como abrir a porta do carro, o porta-malas ou até o porta-luvas.

É usado em ações qeu são necessárias para usarmos o carro, mas que não devolvem nenhuma informação.

```ts
function abrirPortaDoCarro(): void {}
```

-----

O que mais você quer aprender sobre TypeScript com carros?

Essa série vai continuar em breve...

-----

Curta, compartilhe e me siga nas [redes](https://www.iwill.dev/links) para mais conteúdo.
