import { render, h } from 'preact';
import UpSetElement, { UpSetDataProps, UpSetSizeProps, UpSetStyleProps } from '@upsetjs/react';

export * from '@upsetjs/model';
export { UpSetDataProps, UpSetSizeProps, UpSetStyleProps } from '@upsetjs/react';

export declare type UpSetCSSPrpos = CSSStyleDeclaration;

export declare type UpSetPlainStyleProps = {
  setName?: string;
  combinationName?: string;
  labelStyle?: UpSetCSSPrpos;
  setLabelStyle?: UpSetCSSPrpos;
  setNameStyle?: UpSetCSSPrpos;
  axisStyle?: UpSetCSSPrpos;
  combinationNameStyle?: UpSetCSSPrpos;
};

export declare type UpSetProps<T> = UpSetDataProps<T> & UpSetSizeProps & UpSetStyleProps & UpSetPlainStyleProps;

export function renderUpSet<T>(node: HTMLElement, props: UpSetProps<T>) {
  render(h(UpSetElement as any, props), node);
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
