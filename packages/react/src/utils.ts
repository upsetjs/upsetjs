/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */
import { ISetLike, ISetOverlapFunction, setElemOverlapFactory, setOverlapFactory } from '@upsetjs/model';
import type { UpSetSelection } from './interfaces';

export function clsx(...classNames: (boolean | string | undefined)[]) {
  return classNames.filter(Boolean).join(' ');
}

export function generateId(_args?: any) {
  return `upset-${Math.random().toString(36).slice(4)}`;
}

export function isSetLike<T>(s?: UpSetSelection<T>): s is ISetLike<T> {
  return s != null && !Array.isArray(s);
}

function elemOverlapOf<T>(query: Set<T> | readonly T[], toElemKey?: (e: T) => string) {
  const f = setOverlapFactory(query, toElemKey);
  return (s: ISetLike<T>) => {
    return f(s.elems).intersection;
  };
}

export function noGuessPossible() {
  return -1;
}

export function generateSelectionOverlap<T>(
  selection: UpSetSelection<T>,
  overlapGuesser: ISetOverlapFunction<T>,
  toElemKey?: (e: T) => string
): (s: ISetLike<T>) => number {
  if (!selection) {
    return noOverlap;
  }
  if (typeof selection === 'function') {
    return selection;
  }
  if (Array.isArray(selection)) {
    return elemOverlapOf(selection, toElemKey);
  }
  const ss = selection as ISetLike<T>;
  if (ss.overlap) {
    return ss.overlap.bind(ss);
  }
  let f: ((v: ISetLike<T>) => number) | null = null;
  return (s) => {
    if (s.overlap) {
      return s.overlap(ss);
    }
    const guess = overlapGuesser(s, ss);
    if (guess >= 0) {
      return guess;
    }
    if (!f) {
      f = elemOverlapOf(ss.elems, toElemKey);
    }
    return f(s);
  };
}

export function generateSelectionName<T>(selection?: UpSetSelection<T>) {
  return Array.isArray(selection)
    ? `Array(${selection.length})`
    : typeof selection === 'function'
    ? '?'
    : (selection as ISetLike<T>)?.name;
}

export function elemElemOverlapOf<T>(query: Set<T> | readonly T[], toElemKey?: (e: T) => string) {
  const f = setElemOverlapFactory(query, toElemKey);
  return (s: ISetLike<T>) => {
    return f(s.elems).intersection;
  };
}

export function noOverlap() {
  return 0;
}

export function parseFontSize(v?: string) {
  if (v == null) {
    return 10;
  }
  if (v.endsWith('pt')) {
    return Math.floor((4 / 3) * Number.parseInt(v, 10));
  }
  return Number.parseInt(v, 10);
}

export function toAnchor(alignment: 'left' | 'center' | 'right') {
  const alignments = {
    left: 'start',
    center: 'middle',
    right: 'end',
  };
  return alignments[alignment] ?? 'middle';
}
