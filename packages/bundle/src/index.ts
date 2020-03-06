import { render, h } from 'preact';
import UpSetElement, { UpSetProps } from '@upsetjs/react';

export * from '@upsetjs/model';

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
