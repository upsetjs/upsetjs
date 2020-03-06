import { render, h } from 'preact';
import UpSetElement, { UpSetProps, ISetLike, ISets } from '@upsetjs/react';
import Eventemitter from 'eventemitter3';

export * from '@upsetjs/model';

export function renderUpSet<T>(node: HTMLElement, props: UpSetProps<T>) {
  render(h(UpSetElement as any, props), node);
}

export class UpSet<T> extends Eventemitter implements Omit<UpSetProps<T>, 'onHover'> {
  constructor(sets: ISets<T>, width: number, height: number) {
    super();
    this.parent = parent;
  }
  sets: import('../../model/dist').ISets<T>;
  combinations?: import('../../model/dist').ISetCombinations<T> | undefined;
  width: number;
  height: number;
  padding?: number | undefined;
  barPadding?: number | undefined;
  widthRatios?: [number, number, number] | undefined;
  heightRatios?: [number, number] | undefined;
  setName?;
  combinationName?;
  selectionColor?: string | undefined;
  alternatingBackgroundColor?: string | undefined;
  color?: string | undefined;
  notMemberColor?: string | undefined;
  labelStyle?;
  setLabelStyle?;
  setNameStyle?;
  axisStyle?;
  combinationNameStyle?;
  triangleSize?: number | undefined;
  className?: string | undefined;
  style?;

  update() {
    this.render();
  }

  private render() {
    render(
      h(UpSetElement as any, {
        ...this.props,
        onClick: (s: ISetLike<T>) => this.emit('click', s),
        onHover: (s: ISetLike<T> | null) => this.emit('hover', s),
      }),
      this.parent
    );
  }
}

export default UpSet;
