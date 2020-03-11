import { render, h } from 'preact';
import UpSetElement, { UpSetProps as UpSetElementProps } from '@upsetjs/react';

import { ISets, ISetLike, ISetCombinations, UpSetQuery, NumericScaleLike, BandScaleLike } from '@upsetjs/model';
export * from '@upsetjs/model';

export type UpSetSizeProps = {
  /**
   * width of the chart
   */
  width: number;
  /**
   * height of the chart
   */
  height: number;
  /**
   * padding within the svg
   * @default 20
   */
  padding?: number;
  /**
   * padding argument for scaleBand
   * @default 0.1
   */
  barPadding?: number;
  /**
   * width ratios for different plots
   * [set chart, set labels, intersection chart]
   * @default [0.25, 0.1, 0.65]
   */
  widthRatios?: [number, number, number];
  /**
   * height ratios for different plots
   * [intersection chart, set chart]
   * @default [0.6, 0.4]
   */
  heightRatios?: [number, number];

  /**
   * legend width
   * @default 150
   */
  queryLegendWidth?: number;
};

export type UpSetDataProps<T> = {
  /**
   * the sets to visualize
   */
  sets: ISets<T>;
  /**
   * the combinations to visualize by default all combinations
   */
  combinations?: ISetCombinations<T>;
};

export type UpSetSelectionProps<T> = {
  selection?: ISetLike<T> | null;
  onHover?(selection: ISetLike<T> | null): void;
  onClick?(selection: ISetLike<T>): void;

  queries?: ReadonlyArray<UpSetQuery<T>>;
};

export type UpSetStyleProps = {
  selectionColor?: string;
  alternatingBackgroundColor?: string;
  color?: string;
  notMemberColor?: string;
  triangleSize?: number;
  /**
   * show a legend of queries
   * enabled by default when queries are set
   */
  queryLegend?: boolean;

  linearScaleFactory?: (domain: [number, number], range: [number, number]) => NumericScaleLike;
  bandScaleFactory?: (domain: string[], range: [number, number], padding: number) => BandScaleLike;
};

export declare type UpSetCSSStyles = CSSStyleDeclaration & {
  backfaceVisibility: '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'unset' | 'hidden' | 'visible';
};

export declare type UpSetPlainStyleProps = {
  setName?: string;
  combinationName?: string;
  labelStyle?: UpSetCSSStyles;
  setLabelStyle?: UpSetCSSStyles;
  setNameStyle?: UpSetCSSStyles;
  axisStyle?: UpSetCSSStyles;
  combinationNameStyle?: UpSetCSSStyles;
};

export declare type UpSetProps<T> = UpSetDataProps<T> & UpSetSizeProps & UpSetStyleProps & UpSetPlainStyleProps;

export function renderUpSet<T>(node: HTMLElement, props: UpSetProps<T>) {
  const p: UpSetElementProps<T> = props;
  render(h(UpSetElement as any, p), node);
}

// export class UpSet<T> extends Eventemitter implements Omit<UpSetProps<T>, 'onHover'> {
//   constructor(sets: ISets<T>, width: number, height: number) {
//     super();
//     this.parent = parent;
//   }

//   update() {
//     this.render();
//   }

//   private render() {
//     render(
//       h(UpSetElement as any, {
//         ...this.props,
//         onClick: (s: ISetLike<T>) => this.emit('click', s),
//         onHover: (s: ISetLike<T> | null) => this.emit('hover', s),
//       }),
//       this.parent
//     );
//   }
// }

// export default UpSet;
