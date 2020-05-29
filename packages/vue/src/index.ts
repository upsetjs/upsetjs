/**
 * @upsetjs/vue
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import Vue from 'vue';
import { render, UpSetProps as UpSetBundleProps, propValidators } from '@upsetjs/bundle';
export {
  asCombination,
  asCombinations,
  asSet,
  asSets,
  extractSets,
  fromSetName,
  isCalcQuery,
  isElemQuery,
  isSetQuery,
  generateCombinations,
  UpSetQuery,
  UpSetSetQuery,
  UpSetElemQuery,
  UpSetCalcQuery,
  ISet,
  ISets,
  ISetCombination,
  ISetCombinations,
  ISetLike,
  ISetComposite,
  IBaseSet,
  ISetIntersection,
  ISetLikes,
  GenerateSetCombinationsOptions,
  PostprocessCombinationsOptions,
  PostprocessSetOptions,
  BandScaleFactory,
  BandScaleLike,
  NumericScaleFactory,
  NumericScaleLike,
} from '@upsetjs/bundle';

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
    validator: propValidators.widthRatios,
  },
  /**
   * height ratios for different plots
   * [intersection chart, set chart]
   * @default [0.6, 0.4]
   */
  heightRatios: {
    type: Array,
    validator: propValidators.heightRatios,
  },
};

const upsetDataProps = {
  /**
   * the sets to visualize
   */
  sets: {
    type: Array,
    required: true,
    validator: propValidators.sets,
  },
  /**
   * the combinations to visualize by default all combinations
   */
  combinations: {
    type: [Array, Object],
    validator: propValidators.combinations,
    default: () => ({}),
  },
};

const upsetSelectionProps = {
  selection: {
    type: [Array, Object],
    validator: propValidators.selection,
  },
  // onHover?(selection: ISetLike<T> | null): void;
  // onClick?(selection: ISetLike<T> | null): void;

  queries: {
    type: Array,
    validator: propValidators.queries,
  },
};

const upsetThemeProps = {
  selectionColor: String,
  alternatingBackgroundColor: {
    type: [String, Boolean],
    validator: propValidators.stringOrFalse,
  },
  color: String,
  textColor: String,
  hoverHintColor: String,
  notMemberColor: String,
};

const upsetStyleProps = Object.assign({}, upsetThemeProps, {
  theme: {
    type: String,
    validator: propValidators.theme,
  },
  className: String,
  classNames: {
    type: Object,
    validator: propValidators.classNames,
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
  exportButtons: {
    type: [Boolean, Object],
    validator: propValidators.exportButtons,
  },
  /**
   * set to false to use the default font family
   * @default sans-serif
   */
  fontFamily: {
    type: [String, Boolean],
    validator: propValidators.stringOrFalse,
  },
  fontSizes: {
    type: Object,
    validator: propValidators.fontSizes,
  },

  numericScale: {
    type: [String, Function],
    validator: propValidators.numericScale,
  },
  bandScale: {
    type: [String, Function],
    validator: propValidators.bandScale,
  },
  setName: String,
  combinationName: String,
  title: String,
  description: String,
});

const upsetPlainStyleProps = {
  extraStyle: {
    type: Object,
    validator: propValidators.style,
  },
  styles: {
    type: Object,
    validator: propValidators.styles,
  },
};

export interface UpSetProps extends Omit<UpSetBundleProps, 'style'> {
  extraStyle?: CSSStyleDeclaration;
}

function stripUndefined(props: UpSetBundleProps) {
  const p: any = props;
  Object.keys(props).forEach((key) => {
    if (typeof p[key] === 'undefined') {
      delete p[key];
    }
  });
  return props;
}

export default Vue.extend<{}, { renderImpl(): void }, {}, UpSetProps>({
  name: 'UpSet',
  props: Object.assign({}, upsetDataProps, upsetSizeProps, upsetStyleProps, upsetPlainStyleProps, upsetSelectionProps),
  render(createElement) {
    return createElement('div', {
      ref: 'react',
      style: 'display: flex; align-items: center; justify-content: center',
    });
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
      const listeners: Partial<UpSetBundleProps<any>> = {};
      if (this.$listeners.hover) {
        listeners.onHover = (s) => this.$emit('hover', s);
      }
      if (this.$listeners.click) {
        listeners.onClick = (s) => this.$emit('click', s);
      }

      render(
        this.$refs.react as HTMLElement,
        stripUndefined(
          (Object.assign(
            {},
            this.$props,
            {
              style: this.$props.extraStyle,
            },
            this.$attrs,
            listeners
          ) as unknown) as UpSetProps
        )
      );
    },
  },
});
