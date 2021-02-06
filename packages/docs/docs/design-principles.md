---
title: Design Principles
---

UpSet.js is build based on the following design principles:

- **Stateless** -
  UpSet.js is designed to be stateless, so having no internal logic and purely depending on the given input.
  A good example is handling selections. One possible approach is to handle the selection and its management within UpSet.js and report out when things changes.
  However, this makes it more difficult to keep the component with external updates in sync.
  A pure stateless approach solely relies on the given input. For the selection that includes the currently selected set and a callback listener in case the user wants to select another set.

- **Integrations** -
  UpSet.js was designed as an eco-system with an demo application and integrations into popular web frameworks (React `@upsetjs/react` and Vue.js `@upsetjs/vue`) and data science tools (R, Python Jupyter, PowerBI, Tableau, or Observable HQ).
  This should allow a majority of data scientist and developer the possibility to use UpSet.js.

- **One to rule them all** -
  UpSet.js was designed to be used in different web frameworks and data science tools.
  However, to avoid redundant implementation, UpSet.js has only one implementation and has adapters and wrappers to all the other ones.
  The basic implementation is written in React (`@upsetjs/react`). However, by creating a bundled version (`@upsetjs/bundle`) which has no dependencies to any web framework, UpSet.js can be easily integrated into other web frameworks.

- **Shareability** -
  Generated UpSet.js plots should be able to be shared across different tools and web frameworks. UpSet.js plots can be exported to common image formats such as PNG and SVG. However, it also can be exported to [Vega-lite](https://vega.github.io/vega-lite/) and into a JSON format that can be shared and viewed using the [embedded app viewer](/app/embed.html).

More can be found in the Medium post: [UpSet.js — Behind the (technical) Scenes](https://medium.com/@sgratzl/upset-js-behind-the-technical-scenes-6eb0c880a03e?source=friends_link&sk=2e90d4b2e21a9f65e1d387985612dc2b)

---

About the author: [Samuel Gratzl](https://www.sgratzl.com) is main developer behind [UpSet.js](https://upset.js.org). He also developed several other libraries [LineUp.js](https://lineup.js.org), [LineUp-lite](https://lineup-lite.js.org), and numerous [chart.js plugins](https://github.com/sgratzl?tab=repositories&q=chartjs-&type=&language=). In addition, he is the active maintainer of [slack-cleaner](https://github.com/sgratzl/slack-cleaner). Find more about him at his [website](https://wwww.sgratzl.com) or visit his [GitHub profile](https://github.com/sgratzl).
