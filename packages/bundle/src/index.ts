import { render, h } from 'preact';
import UpSetElement, { UpSetProps, ISetLike } from '@upsetjs/react';
import Eventemitter from 'eventemitter3';

export * from '@upsetjs/model';

export function renderUpSet<T>(node: HTMLElement, props: UpSetProps<T>) {
  render(h(UpSetElement as any, props), node);
}

export default class UpSet<T> extends Eventemitter {
  private readonly node: HTMLElement;

  constructor(node: HTMLElement = document.createElement('div')) {
    super();
    this.node = node;
  }

  update() {
    this.render();
  }

  private render() {
    render(
      h(UpSetElement as any, {
        ...{},
        onClick: (s: ISetLike<T>) => this.emit('click', s),
        onHover: (s: ISetLike<T> | null) => this.emit('hover', s),
      }),
      this.node
    );
  }
}
