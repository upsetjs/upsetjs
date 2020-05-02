<template>
  <div id="app">
    <UpSetJS :sets="sets" :width="width" :height="height" @hover="hover" :selection="selection"></UpSetJS>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import UpSetJS, { extractSets, ISets, ISet } from '@upsetjs/vue';

interface Elem {
  name: string;
  sets: string[];
}

export default Vue.extend<
  { elems: Elem[]; width: number; height: number; selection: ISet<Elem> | null },
  { hover(s: ISet<Elem> | null): void },
  { sets: ISets<Elem> },
  {}
>({
  name: 'App',
  components: {
    UpSetJS,
  },
  data() {
    return {
      elems: [
        {
          name: 'Alton Lannister',
          sets: ['was killed', 'Lannister', 'male'],
        },
        {
          name: 'Arya Stark',
          sets: ['Stark', 'female'],
        },
        {
          name: 'Benjen Stark',
          sets: ['was killed', 'Stark', 'male'],
        },
        {
          name: 'Bran Stark',
          sets: ['royal', 'Stark', 'male'],
        },
        {
          name: 'Brandon Stark',
          sets: ['was killed', 'Stark'],
        },
        {
          name: 'Catelyn Stark',
          sets: ['was killed', 'Stark', 'female'],
        },
        {
          name: 'Cersei Lannister',
          sets: ['royal', 'was killed', 'Lannister', 'female'],
        },
        {
          name: 'Eddard Stark',
          sets: ['was killed', 'Stark', 'male'],
        },
        {
          name: 'Jaime Lannister',
          sets: ['was killed', 'Lannister', 'male'],
        },
        {
          name: 'Jon Snow',
          sets: ['royal', 'was killed', 'Stark', 'male'],
        },
        {
          name: 'Kevan Lannister',
          sets: ['was killed', 'Lannister', 'male'],
        },
        {
          name: 'Lancel Lannister',
          sets: ['was killed', 'Lannister', 'male'],
        },
        {
          name: 'Lyanna Stark',
          sets: ['was killed', 'Stark', 'female'],
        },
        {
          name: 'Martyn Lannister',
          sets: ['was killed', 'Lannister', 'male'],
        },
        {
          name: 'Rickard Stark',
          sets: ['was killed', 'Stark', 'male'],
        },
        {
          name: 'Rickon Stark',
          sets: ['was killed', 'Stark', 'male'],
        },
        {
          name: 'Robb Stark',
          sets: ['royal', 'was killed', 'Stark', 'male'],
        },
        {
          name: 'Sansa Stark',
          sets: ['royal', 'Stark', 'female'],
        },
        {
          name: 'Tyrion Lannister',
          sets: ['Lannister', 'male'],
        },
        {
          name: 'Tywin Lannister',
          sets: ['was killed', 'Lannister', 'male'],
        },
        {
          name: 'Willem Lannister',
          sets: ['was killed', 'Lannister', 'male'],
        },
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
});
</script>

<style>
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
</style>
