import Vue from 'vue';
import { renderUpSet, UpSetProps } from '@upsetjs/bundle';

export default Vue.extend({
  name: 'UpSet',
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    sets: {
      type: Array,
      required: true,
    },
  },
  render(createElement) {
    return createElement('div', { ref: 'react' });
  },
  inheritAttrs: false,
  watch: {
    $attrs: {
      deep: true,
      handler() {
        if (this.$refs.react) {
          this.renderImpl();
        }
      },
    },
    $listeners: {
      deep: true,
      handler() {
        if (this.$refs.react) {
          this.renderImpl();
        }
      },
    },
  },
  mounted() {
    this.renderImpl();
  },
  methods: {
    renderImpl() {
      // $listeners
      renderUpSet(
        this.$refs.react as HTMLElement,
        (Object.assign({}, this.$attrs, this.$listeners) as unknown) as UpSetProps<any>
      );
    },
  },
});
