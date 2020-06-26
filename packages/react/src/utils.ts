/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */
import { ISetLike, setElemOverlapFactory, setOverlapFactory } from '@upsetjs/model';
import { UpSetSelection } from './interfaces';

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

export function generateSelectionOverlap<T>(
  selection: ISetLike<T> | null | readonly T[] | ((s: ISetLike<T>) => number) | undefined,
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
  const f = elemOverlapOf(ss.elems, toElemKey);
  return (s) => {
    return s.overlap ? s.overlap(ss) : f(s);
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
