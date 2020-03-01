export { extractSets } from 'upsetjs';
import { render, h } from 'preact';

export function renderUpSet(node: HTMLElement, props: any) {
  render(h(UpSet, props), node);
}
