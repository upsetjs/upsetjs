import { ISetLike } from '@upsetjs/model';

function noop() {
  return undefined;
}

export function wrap<T>(f?: (set: ISetLike<T>) => void) {
  if (!f) {
    return noop;
  }
  return (set: ISetLike<T>) => {
    return function (this: any) {
      return f.call(this, set);
    };
  };
}

export function clsx(...clazzes: (boolean | string | undefined)[]) {
  return clazzes.filter(Boolean).join(' ');
}
