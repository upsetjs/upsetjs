<template>
  <div id="app">
    <UpSet :sets="sets" :width="width" :height="height" @hover="hover" :selection="selection"></UpSet>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import UpSet, { extractSets, ISets, ISet } from '@upsetjs/vue';

export default Vue.extend<
  { elems: any[]; width: number; height: number; selection: ISet<any> | null },
  { hover(s: ISet<any> | null): void },
  { sets: ISets<any> },
  {}
>({
  name: 'App',
  components: {
    UpSet,
  },
  data() {
    return {
      elems: [
        { name: 'Lisa', sets: ['School'] },
        { name: 'Bart', sets: ['School', 'Male'] },
        { name: 'Homer', sets: ['Duff Fan', 'Male'] },
        { name: 'Marge', sets: ['Blue Hair'] },
        { name: 'Maggie', sets: [] },
        { name: 'Barney', sets: ['Duff Fan', 'Male'] },
        { name: 'Mr. Burns', sets: ['Evil', 'Male'] },
        { name: 'Mo', sets: ['Duff Fan', 'Male'] },
        { name: 'Ned', sets: ['Male'] },
        { name: 'Milhouse', sets: ['School', 'Blue Hair', 'Male'] },
        { name: 'Grampa', sets: ['Male'] },
        { name: 'Krusty', sets: ['Duff Fan', 'Evil', 'Male'] },
        { name: 'Smithers', sets: ['Evil', 'Male'] },
        { name: 'Ralph', sets: ['School', 'Male'] },
        { name: 'Sideshow Bob', sets: ['Evil', 'Male'] },
        { name: 'Kent Brockman', sets: ['Male'] },
        { name: 'Fat Tony', sets: ['Evil', 'Male'] },
        { name: 'Jacqueline Bouvier ', sets: ['Blue Hair'] },
        { name: 'Patty Bouvier', sets: [] },
        { name: 'Selma Bouvier', sets: [] },
        { name: 'Lenny Leonard', sets: ['Duff Fan', 'Male'] },
        { name: 'Carl Carlson', sets: ['Duff Fan', 'Male'] },
        { name: 'Nelson', sets: ['School', 'Evil', 'Male'] },
        { name: 'Martin Prince', sets: ['School', 'Male'] },
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
    hover(s: ISet<any> | null) {
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
