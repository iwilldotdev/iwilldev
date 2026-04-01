---
title: "Por que eu amo Remix? \n(por Kent C. Dodds)"
date: "2023-01-26T00:00:00.000"
tags: ["Remix", "React"]
author: "William Gonçalves"
authorImage: "https://github.com/iwilldotdev.png"
backgroundImage: "remix"
---

Esse artigo é uma tradução do post [Why I Love Remix](https://kentcdodds.com/blog/why-i-love-remix) do [Kent C. Dodds](https://kentcdodds.com). Obrigado, Kent, por permitir a tradução do conteúdo e por compartilhar tanto conhecimento com a comunidade.

-----

[kentcdodds.com](https://kentcdodds.com) é totalmente feito por mim (e pelo [time](https://kentcdodds.com/credits)) usando [Remix](https://remix.run). Depois de escrever dezenas de milhares de linhas de código usando esse framework, criei grande apreciação pelo que ele pode fazer por mim e pelos usuários do meu site. E quero te falar um pouco sobre isso.

## Em uma frase

Essa é a principal razão pela qual eu amo usar o Remix para construir sites:

> ### Remix me permite construir experiências de usuário incríveis e ainda ficar feliz com o código que eu tive que escrever para chegar lá.

E o que isso significa? Vamos nos aprofundar...

## A Experiência do Usuário

Há um monte de fatores que impactam a experiência do usuário quando eles usam nossos softwares. Na maior parte do tempo, acho que as pessoas estão focadas na performance/velocidade e, embora isso seja uma parte importante, é apenas um pedaço do todo. A experiência do usuário inclui uma série de outros aspectos do seu site. Aqui estão alguns:

- Acessibilidade
- Performance
- "Reflow" de conteúdo (quando um navegador processa e remonta parte ou toda uma página, após uma atualização ou interação).
- Confiabilidade e disponibilidade
- Tratamento de erros
- Gerenciamento de pendências
- Gerenciamento de estado
- Melhoria progressiva
- Resiliência (comportamento em condições de rede ruins)
- Layout
- Clareza do conteúdo

Até mesmo a velocidade de desenvolvimento de features pode impactar a experiência do usuário. Então a UX é [indiretamente impactada](https://kentcdodds.com/blog/why-users-care-about-how-you-write-code) pela manutenibilidade do nosso código.

Remix nos ajuda com muitos desses aspectos. Alguns sem que eu precise pensar nisso. Em particular, alguns dos maiores desafios envolvendo gerenciamento de estado (race conditions de mutações e carregamento de dados) são totalmente gerenciados dentro do framework. Por causa disso, os usuários não se deparam com a necessidade de atualizar a página porque estão vendo dados desatualizados. Isso acontece sem que eu precise pensar nisso. É como o Remix funciona.

Remix faz muito para manter meu site rápido através do uso de tags `<Link />` para pré-carregar recursos e dados no momento certo. Às vezes, fico impressionado com o fato de meu site _parecer_ composto por arquivos estáticos em um CDN, mas _na verdade_ é renderizado/hidratado no servidor e cada página é completamente única para cada usuário (portanto, um cache HTTP compartilhado em um CDN não seria possível).

Usar as APIs da plataforma é o que nos permite isso. É também o que faz o Remix ser tão resiliente e ótimo para melhorias progressivas. Em condições de rede ruins, onde o carregamento do JavaScript é lento ou falha, a API padrão do Remix para mutações (`<Form />`) vai funcionar mesmo antes do app ser hidratado. Isso significa que o usuário pode começar a fazer o trabalho com o app, mesmo que esteja em uma conexão ruim. Muito melhor do que um botão em que o handler do `onClick` ainda não foi carregado (que era o meu padrão antes do Remix)!

A forma declarativa do Remix tratar erros me permite lidar com eles no contexto em que eles acontecem. Combinado com o roteamento aninhado, o que você obtém é a capacidade de renderizar um erro contextual sem quebrar o resto do app.

![Exemplo de como os erros são exibidos dentro do contexto em que acontecem - imagem do post original](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dn27vfcko1q8d71s7ohp.png)

E isso também funciona no servidor (que é sem igual no Remix), então os usuários terão a mesma experiência, independente do erro ter acontecido durante uma transição no client ou em um carregamento completo da página.

> ### Remix traz a excelência como padrão da experiência do usuário. E é uma das principais razões pelas quais eu amo o framework.

## O Código

Os apps que eu ajudei a construir são usados por milhões de pessoas pelo mundo. Construir sites com Remix me faz feliz com o código que coloco em produção. A maior razão para isso é que antes do Remix eu gastava muito tempo tentando resolver problemas de experiência do usuário. Pelo Remix ajudar tanto com a UX, lido com menos complexidades no código. Então tudo que me resta fazer é usar as APIs declarativas que Remix (e React) me dão, para construir meu app e a experiência do usuário é boa por padrão.

> ### Quando uso Remix, posso deixar os _truques_ em casa.

Francamente, esse é o maior ponto a se falar sobre o código: você percebe que códigos de demonstração são normalmente mais simples, ignorando nuances como estados pendentes, race conditions, tratamento de erros, acessibilidade, etc? Bem, meu código não é tão simples como um código de demonstração, mas o Remix deixa ele bem próximo, em simplicidade. Eu definitivamente ainda penso em acessibilidade (apesar das bibliotecas [@reach-ui](https://reach.tech) do Remix ajudarem bastante com isso) e estados pendentes/erros. Mas as APIs que o Remix me dá para essas coisas são simples e declarativas:

```tsx
// app/events/$eventId/attendees.tsx

const loader: LoaderFunction = async ({request, params}) => {

  // isso é executado no servidor
  // erros inesperados de execução irão disparar o ErrorBoundary para ser renderizado
  // erros esperados (como 401s, 404s, etc) irão renderizar o CatchBoundary
  // caso contrário, retorno uma resposta e isso irá renderizar o componente padrão

  return json(data)
}

export default function AttendeesRoute() {
  const data = useLoaderData()
  return <div>{/* renderiza os dados em 'data' */}</div>
}

export function ErrorBoundary({error}) {
  return <div>{/* renderiza uma mensagem do erro inesperado */}</div>
}

export function CatchBoundary() {
  const caught = useCatch()
  return <div>{/* renderiza a mensagem de erro para respostas tipo 400 */}</div>
}
```

Ah! E para estados pendentes (seja mutações ou transições regulares) você pode colocar isso onde quiser que o efeito de Pending UI apareça (seja global ou local):

```tsx
const transition = useTransition()

const text =
  transition.state === 'submitting'
    ? 'Saving...'
    : transition.state === 'loading'
    ? 'Saved!'
    : 'Ready'
```

Isso simplifica drasticamente o código React que eu escrevo, ao ponto de eu não escrever nenhum código React ligado a HTTP. Essa comunicação _client-server_ é totalmente gerenciada pelo Remix de uma forma que otimiza a UX. E a fronteira entre cliente e servidor pode ser totalmente tipada, então eu gasto menos tempo indo e voltando entre o navegador e o editor para corrigir erros bobos.

Também amo o fato do Remix ser fundamentado nas APIs da Web. Essa função `json` que chamamos na loader é apenas uma função simples para criar um objeto [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response). Isso mesmo! Se você quiser aprender a fazer algo com o Remix, gastará mais tempo na [mdn](https://developer.mozilla.org) do que na  [documentação do Remix](https://docs.remix.run) e isso me leva a outra coisa que amo sobre o Remix:

> ### Quanto melhor eu construo sites com Remix, melhor eu construo sites para a web.

Isso acontece naturalmente graças ao fato do Remix usar muito da plataforma web e recorrer, o máximo possível, às APIs da Web. (Isso é semelhante ao fato de quanto melhor eu me sinto com React, melhor eu me sinto com JavaScript.)

E pelo Remix ser fundamentado nas APIs da Web como a interface comum para o servidor, você pode implantar o mesmo aplicativo em qualquer plataforma (desde que o código que você traga junto funcione nessas plataformas) e tudo que você precisa fazer é mudar qual _adapter_ você está usando. Se você quiser executar em serverless ou em um contêiner Docker, o Remix cuida de tudo. 

Remix é o jQuery das plataformas de hospedagem. Ele normaliza as diferenças para que você possa escrever uma vez e hospedar em qualquer lugar.

Outro lance incrível da `loader` é que, como ela é executada no servidor, eu posso integrar com APIs que me dão muito mais dados do que eu preciso e filtrar apenas o que é necessário. Isso significa que eu posso eliminar o problema de overfetching (sobrecarga de dados) que nos leva a usar a complexidade do `graphql`, por exemplo. Quero dizer, você ainda pode utilizar o `graphql` com o Remix, mas já que ele gerencia a comunicação cliente-servidor pra você, não há a necessidade de enviar uma biblioteca `graphql` enorme e complexa para o navegador: é só confiar no Remix para fazer a coisa certa no momento certo (o que ele faz). 

E se eu precisar de dados extras, basta voltar na loader e incluí-los na resposta. Tudo tipado e pronto para o código do lado do cliente. É fabuloso.

Eu mencionei o componente `<Form />` anteriormente e como ele ainda funcionará mesmo antes do JavaScript ser carregado. E isso é ótimo para a experiência do usuário. E também é ótimo para a DX (Developer Experience - Experiência do Desenvolvedor), porque não preciso gerenciar um monte de `fetch` e estados para minhas mutações. Normalmente, tenho um `onSubmit` que adiciona um `event.preventDefault()`, `fetch`s, gerenciamento de race condition e invalidação de cache. Bem, com o Remix, tudo isso some e eu fico com uma API declarativa para as mutações:

```tsx
// app/events/$eventId/attendees.tsx

const action: ActionFunction = async ({request}) => {

  /* isso é executado no servidor e eu posso lidar com os dados
  do formulário (formData) aqui, seja em uma interação direta com o
  banco de dados ou chamando um serviço downstream para realizar
  a mutação. É simplesmente brilhante. */

  return redirect(/* envie o usuário pra onde quiser, depois disso */)
}

export default function AttendeesRoute() {
  // Olha só! Nenhum event handler ou useEffect necessário!
  // Race conditions resolvidas.
  return (
    <Form method="post">
      <div>
        <label htmlFor="name-input">Name: </label>
        <input id="name-input" name="name" />
      </div>
      <div>
        <label htmlFor="email-input">Email: </label>
        <input id="email-input" name="email" type="email" />
      </div>
      <button type="submit">Add Attendee</button>
    </Form>
  )
}
```

Ah! E você quer validação, certo? Bem, se você quiser fazer isso no servidor, então pode colocá-la na `action`. E se você quiser validar no cliente também? Bem, você literalmente move a lógica de validação da `action` para uma função e chama-a tanto na `action` quanto no seu componente. É isso!

## Conclusão

Eu poderia seguir em frente, falando mais. Há tantos posts e workshops dentro da minha cabeça. Eu nem falei sobre como é simples implementar o Optimistic UI com o Remix, autenticação segura, abstração (reuso de código), paginação, não precisar de componentes `<Layout />` graças ao roteamento aninhado, e muito mais. Eu vou falar sobre tudo isso eventualmente, prometo.

E no fim do dia, tudo volta a isso:

> ### Eu amo o Remix porque ele me permite construir experiências incríveis para o usuário e ainda ficar feliz com o código que escrevi para chegar lá.

E isso é algo que eu posso apoiar e impulsionar.

Quer se juntar a mim?