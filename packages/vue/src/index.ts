import Vue from 'vue';
import { renderUpSet, UpSetProps, validators } from '@upsetjs/bundle';

const upsetSizeProps = {
  /**
   * width of the chart
   */
  width: {
    type: Number,
    required: true,
  },
  /**
   * height of the chart
   */
  height: {
    type: Number,
    required: true,
  },
  /**
   * padding within the svg
   * @default 20
   */
  padding: Number,
  /**
   * padding argument for scaleBand
   * @default 0.1
   */
  barPadding: Number,
  /**
   * padding factor the for dots
   * @default 0.7
   */
  dotPadding: Number,
  /**
   * width ratios for different plots
   * [set chart, set labels, intersection chart]
   * @default [0.25, 0.1, 0.65]
   */
  widthRatios: {
    type: Array,
    validator: validators.widthRatios,
  },
  /**
   * height ratios for different plots
   * [intersection chart, set chart]
   * @default [0.6, 0.4]
   */
  heightRatios: {
    type: Array,
    validator: validators.heightRatios,
  },
};

const upsetDataProps = {
  /**
   * the sets to visualize
   */
  sets: {
    type: Array,
    required: true,
    validator: validators.sets,
  },
  /**
   * the combinations to visualize by default all combinations
   */
  combinations: {
    type: [Array, Object],
    validator: validators.combinations,
  },
};

const upsetSelectionProps = {
  selection: {
    type: [Array, Object],
    validator: validators.selection,
  },
  // onHover?(selection: ISetLike<T> | null): void;
  // onClick?(selection: ISetLike<T> | null): void;

  queries: {
    type: Array,
    validator: validators.queries,
  },
};

const upsetThemeProps = {
  selectionColor: String,
  alternatingBackgroundColor: {
    type: [String, Boolean],
    validator: validators.stringOrFalse,
  },
  color: String,
  textColor: String,
  hoverHintColor: String,
  notMemberColor: String,
};

const upsetStyleProps = Object.assign({}, upsetThemeProps, {
  theme: {
    type: String,
    validator: validators.theme,
  },
  className: String,
  classNames: {
    type: Object,
    validator: validators.classNames,
  },
  barLabelOffset: Number,
  setNameAxisOffset: Number,
  combinationNameAxisOffset: Number,
  /**
   * show a legend of queries
   * enabled by default when queries are set
   */
  queryLegend: Boolean,

  /**
   * show export buttons
   * @default true
   */
  exportButtons: Boolean,
  /**
   * set to false to use the default font family
   * @default sans-serif
   */
  fontFamily: {
    type: [String, Boolean],
    validator: validators.stringOrFalse,
  },
  fontSizes: {
    type: Object,
    validator: validators.fontSizes,
  },

  numericScale: {
    type: [String, Function],
    validator: validators.numericScale,
  },
  bandScale: {
    type: [String, Function],
    validator: validators.bandScale,
  },
  setName: String,
  combinationName: String,
});

export declare type UpSetCSSStyles = CSSStyleDeclaration & {
  backfaceVisibility: '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'unset' | 'hidden' | 'visible';
};

const upsetPlainStyleProps = {
  style: {
    type: Object,
    validator: validators.style,
  },
  styles: {
    type: Object,
    validator: validators.styles,
  },
};

export default Vue.extend<{}, { renderImpl(): void }, {}, UpSetProps>({
  name: 'UpSet',
  props: Object.assign({}, upsetDataProps, upsetSizeProps, upsetStyleProps, upsetPlainStyleProps, upsetSelectionProps),
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
