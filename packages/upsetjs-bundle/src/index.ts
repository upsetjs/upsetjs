import { render, h } from 'preact';
import UpSet from 'upsetjs';

export { extractSets } from 'upsetjs';

export function renderUpSet(node: HTMLElement, props: any) {
  render(h(UpSet, props), node);
}
