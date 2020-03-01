import { render, h } from 'preact';
import UpSet, { UpSetProps } from '@upsetjs/react';

export { extractSets } from '@upsetjs/react';

export function renderUpSet<T>(node: HTMLElement, props: UpSetProps<T>) {
  render(h(UpSet as any, props), node);
}
