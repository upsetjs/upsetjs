# UpSet.js Vue

[![NPM Package][npm-image]][npm-url] [![Github Actions][github-actions-image]][github-actions-url]

This package is part of the UpSet.js ecosystem located at the main [Github Monorepo](https://github.com/upsetjs/upsetjs).

This is a [Vue](https://vuejs.org) wrapper around the `@upsetjs/bundle` package.

## Installation

```sh
npm install @upsetjs/vue vue
```

## Usage

```html
<template>
  <div>
    <UpSetJS :sets="sets" :width="width" :height="height" @hover="hover" :selection="selection"></UpSetJS>
  </div>
</template>
<script>
  import Vue from 'vue';
  import UpSetJS, { extractSets, ISets, ISet } from '@upsetjs/vue';

  const stories = {
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
      hover(s: ISet<Elem> | null) {
        this.selection = s;
      },
    },
  };
</script>
```

see also the [vue example application](https://github.com/com/upsetjs/upsetjs/tree/master/packags/vue-example) and deployed at https://upset.js.org/vue

## Privacy Policy

UpSet.js is a client only library. The library or any of its integrations doesn't track you or transfers your data to any server. The uploaded data in the app are stored in your browser only using IndexedDB. The Tableau extension can run in a sandbox environment prohibiting any server requests. However, as soon as you export your session within the app to an external service (e.g., Codepen.io) your data will be transferred.

## License / Terms of Service

### Commercial license

If you want to use UpSet.js for a commercial application or in a commercial environment, the commercial license is the appropriate license. Contact [@sgratzl](mailto:sam@sgratzl.com) for details.

### Open-source license

This library is released under the `GNU AGPLv3` version to be used for private and academic purposes.
In case of a commercial use, please get in touch regarding a commercial license.
[npm-image]: https://badge.fury.io/js/%40upsetjs%2Fvue.svg
[npm-url]: https://npmjs.org/package/@upsetjs/vue
[github-actions-image]: https://github.com/upsetjs/upsetjs/workflows/nodeci/badge.svg
[github-actions-url]: https://github.com/upsetjs/upsetjs/actions
