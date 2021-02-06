---
title: Vue.js
---

## Install

```sh
npm install @upsetjs/vue vue
```

or

```sh
yarn add @upsetjs/vue vue
```

## Example

```html
<template>
  <div id="app">
    <UpSetJS :sets="sets" :width="width" :height="height" @hover="hover" :selection="selection"></UpSetJS>
  </div>
</template>
```

```js
import Vue from 'vue';
import UpSetJS, { extractSets, ISets, ISet } from '@upsetjs/vue';

interface Elem {
  name: string;
  sets: string[];
}

export default Vue.extend({
  name: 'App',
  components: {
    UpSetJS,
  },
  data() {
    return {
      elems: [
        { name: 'A', sets: ['S1', 'S2'] },
        { name: 'B', sets: ['S1'] },
        { name: 'C', sets: ['S2'] },
        { name: 'D', sets: ['S1', 'S3'] },
      ],
      width: 100,
      height: 100,
      selection: null,
    };
  },
  computed: {
    sets() {
      return extractSets(this.elems);
    },
  },
  mounted() {
    const bb = this.$el.getBoundingClientRect();
    this.width = bb.width;
    this.height = bb.height;
  },
  methods: {
    hover(s) {
      this.selection = s;
    },
  },
});
```

```css
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
#app > * {
  flex: 1 1 0;
}
```
