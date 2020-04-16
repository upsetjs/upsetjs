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
    <UpSet :sets="sets" :width="width" :height="height" @hover="hover" :selection="selection"></UpSet>
  </div>
</template>
<script>
  import Vue from 'vue';
  import UpSet, { extractSets, ISets, ISet } from '@upsetjs/vue';

  export default {
    components: {
      UpSet,
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

## License

### Commercial license

If you want to use Upset.js for a commercial application the commercial license is the appropriate license. Contact [@sgratzl](mailto:sam@sgratzl.com) for details.

### Open-source license

This library is released under the `GNU AGPLv3` version to be used for private and academic purposes. In case of a commercial use, please get in touch regarding a commercial license.

[npm-image]: https://badge.fury.io/js/%40upsetjs%2Fvue.svg
[npm-url]: https://npmjs.org/package/@upsetjs/vue
[github-actions-image]: https://github.com/sgratzl/upsetjs/workflows/nodeci/badge.svg
[github-actions-url]: https://github.com/sgratzl/upsetjs/actions
