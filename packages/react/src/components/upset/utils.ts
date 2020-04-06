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

export function addonPositionGenerator(total: number) {
  let beforeAcc = 0;
  let afterAcc = 0;
  return (addon: { position?: 'before' | 'after'; size: number }) => {
    let x = 0;
    if (addon.position === 'before') {
      beforeAcc += addon.size;
      x = -beforeAcc;
    } else {
      x = total + afterAcc;
      afterAcc += addon.size;
    }
    return x;
  };
}
