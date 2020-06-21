/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetLike } from '@upsetjs/model';

function noop() {
  return undefined;
}

export function wrap<T>(f?: (set: ISetLike<T>, evt: MouseEvent) => void) {
  if (!f) {
    return noop;
  }
  return (set: ISetLike<T>) => {
    return function (this: any, evt: React.MouseEvent) {
      return f.call(this, set, evt.nativeEvent);
    };
  };
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

export function mergeColor(style?: React.CSSProperties, color?: string, prop = 'fill') {
  if (!color) {
    return style;
  }
  if (!style) {
    return !color ? undefined : { [prop]: color };
  }
  return Object.assign({ [prop]: color }, style);
}
