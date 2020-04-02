import { render, h, hydrate } from 'preact';
import UpSetElement, { UpSetProps as UpSetElementProps, fillDefaults as fillDefaultsImpl } from '@upsetjs/react';
import * as validator from './validators';

export * from './interfaces';
import {
  UpSetDataProps,
  UpSetPlainStyleProps,
  UpSetSelectionProps,
  UpSetSizeProps,
  UpSetStyleProps,
} from './interfaces';

export const validators = validator;

export declare type UpSetProps<T = any> = UpSetDataProps<T> &
  UpSetSizeProps &
  UpSetStyleProps &
  UpSetPlainStyleProps &
  UpSetSelectionProps<T>;

export function fillDefaults<T = any>(props: UpSetProps<T>) {
  const p: UpSetElementProps<T> = props;
  return fillDefaultsImpl(p) as Required<UpSetDataProps<T>> &
    Required<UpSetSizeProps> &
    Required<UpSetStyleProps> &
    UpSetPlainStyleProps &
    UpSetSelectionProps<T>;
}

export function renderUpSet<T = any>(node: HTMLElement, props: UpSetProps<T>) {
  const p: UpSetElementProps<T> = props;
  render(h(UpSetElement as any, p), node);
}

export function hydrateUpSet<T = any>(node: HTMLElement, props: UpSetProps<T>) {
  const p: UpSetElementProps<T> = props;
  hydrate(h(UpSetElement as any, p), node);
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
