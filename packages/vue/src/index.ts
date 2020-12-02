/**
 * @upsetjs/vue
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import Vue from 'vue';
import {
  render,
  UpSetProps as UpSetBundleProps,
  propValidators,
  renderVennDiagram,
  VennDiagramProps as VennDiagramBundleProps,
  KarnaughMapProps as KarnaughMapBundleProps,
  renderKarnaughMap,
  UpSetSelectionProps,
} from '@upsetjs/bundle';
import { RecordPropsDefinition } from 'vue/types/options';
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

const baseDataProps = {
  /**
   * the sets to visualize
   */
  sets: {
    type: Array,
    required: true,
    validator: propValidators.sets,
  },
  toKey: {
    type: Function,
    required: false,
  },

  toElemKey: {
    type: Function,
    required: false,
  },
};

const upsetDataProps = {
  /**
   * the combinations to visualize by default all combinations
   */
  combinations: {
    type: [Array, Object],
    validator: propValidators.combinations,
    default: () => ({}),
  },

  numericScale: {
    type: [String, Function],
    validator: propValidators.numericScale,
  },
  bandScale: {
    type: [String, Function],
    validator: propValidators.bandScale,
  },
};

const vennDiagramDataProps = {
  valueFormat: {
    type: Function,
    required: false,
  },
};
const kMapDataProps = {
  /**
   * the combinations to visualize by default all combinations
   */
  combinations: {
    type: [Array, Object],
    validator: propValidators.combinations,
    default: () => ({}),
  },

  numericScale: {
    type: [String, Function],
    validator: propValidators.numericScale,
  },
};

const baseLayoutProps = {
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
};

const upsetLayoutProps = {
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

  /**
   * alignment for the set labels
   * @default 'center'
   */
  setLabelAlignment: {
    type: String,
    validator: propValidators.setLabelAlignment,
  },
};

const vennDiagramLayoutProps = {
  /**
   * function used to perform the venn diagram layout
   */
  layout: Function,

  filled: Boolean,
};

const kMapLayoutProps = {
  /**
   * padding argument for scaleBand
   * @default 0.1
   */
  barPadding: Number,
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

const baseThemeProps = {
  selectionColor: String,
  color: String,
  hasSelectionColor: String,
  opacity: Number,
  hasSelectionOpacity: Number,
  textColor: String,
};

const upsetThemeProps = {
  hoverHintColor: String,
  notMemberColor: String,
  alternatingBackgroundColor: {
    type: [String, Boolean],
    validator: propValidators.stringOrFalse,
  },
};

const vennDiagramThemeProps = {
  valueTextColor: String,
  strokeColor: String,
};

const kMapThemeProps = {
  strokeColor: String,
};

const baseElementProps = {
  id: String,
  className: String,
  classNames: {
    type: Object,
    validator: propValidators.classNames,
  },
  extraStyle: {
    type: Object,
    validator: propValidators.style,
  },
  styles: {
    type: Object,
    validator: propValidators.styles,
  },
};

const baseStyleProps = {
  theme: {
    type: String,
    validator: propValidators.theme,
  },
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

  title: String,
  description: String,

  fontSizes: {
    type: Object,
    validator: propValidators.fontSizes,
  },
};

const upsetStyleProps = {
  barLabelOffset: Number,
  setNameAxisOffset: {
    type: [String, Number],
    validator: propValidators.axisOffset,
  },
  combinationNameAxisOffset: {
    type: [String, Number],
    validator: propValidators.axisOffset,
  },

  setName: String,
  combinationName: String,
};

export interface UpSetProps extends Omit<UpSetBundleProps, 'style'> {
  extraStyle?: CSSStyleDeclaration;
}

export interface VennDiagramProps extends Omit<VennDiagramBundleProps, 'style'> {
  extraStyle?: CSSStyleDeclaration;
}

export interface KarnaughMapProps extends Omit<KarnaughMapBundleProps, 'style'> {
  extraStyle?: CSSStyleDeclaration;
}

function stripUndefined<P>(props: P) {
  const p: any = props;
  Object.keys(props).forEach((key) => {
    if (typeof p[key] === 'undefined') {
      delete p[key];
    }
  });
  return props;
}

function create<P>(name: string, props: RecordPropsDefinition<P>, render: (node: HTMLElement, props: P) => void) {
  return Vue.extend<{}, { renderImpl(): void; createListenerProps(): UpSetSelectionProps<any> }, {}, P>({
    name,
    props,
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
      createListenerProps() {
        const listeners: UpSetSelectionProps<any> = {};
        if (this.$listeners.hover) {
          listeners.onHover = (s, evt, infos) => this.$emit('hover', s, evt, infos);
        }
        if (this.$listeners.click) {
          listeners.onClick = (s, evt, infos) => this.$emit('click', s, evt, infos);
        }
        if (this.$listeners.contextMenu) {
          listeners.onContextMenu = (s, evt, infos) => this.$emit('contextMenu', s, evt, infos);
        }
        if (this.$listeners.mouseMove) {
          listeners.onMouseMove = (s, evt, infos) => this.$emit('mouseMove', s, evt, infos);
        }
        return listeners;
      },
      renderImpl() {
        render(
          this.$refs.react as HTMLElement,
          stripUndefined<P>(
            (Object.assign(
              {},
              this.$props,
              {
                style: this.$props.extraStyle,
              },
              this.$attrs,
              this.createListenerProps()
            ) as unknown) as P
          )
        );
      },
    },
  });
}

export default create<UpSetProps>(
  'UpSetJS',
  Object.assign(
    {},
    baseDataProps,
    upsetDataProps,
    baseLayoutProps,
    upsetLayoutProps,
    baseStyleProps,
    upsetStyleProps,
    baseThemeProps,
    upsetThemeProps,
    baseElementProps,
    upsetSelectionProps
  ),
  render
);

export const VennDiagram = create<VennDiagramProps>(
  'VennDiagram',
  Object.assign(
    {},
    baseDataProps,
    vennDiagramDataProps,
    baseLayoutProps,
    vennDiagramLayoutProps,
    baseStyleProps,
    baseThemeProps,
    vennDiagramThemeProps,
    baseElementProps,
    upsetSelectionProps
  ),
  renderVennDiagram
);

export const KarnaughMap = create<KarnaughMapProps>(
  'KarnaughMap',
  Object.assign(
    {},
    baseDataProps,
    kMapDataProps,
    baseLayoutProps,
    kMapLayoutProps,
    baseStyleProps,
    baseThemeProps,
    kMapThemeProps,
    baseElementProps,
    upsetSelectionProps
  ),
  renderKarnaughMap
);
