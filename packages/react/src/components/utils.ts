/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISetLike } from '@upsetjs/model';
import type { UpSetAddonHandlerInfos, UpSetAddons } from '../interfaces';

function noop() {
  return undefined;
}

export function wrap<T>(f?: (set: ISetLike<T>, evt: MouseEvent, addonInfos: UpSetAddonHandlerInfos) => void) {
  if (!f) {
    return noop;
  }
  return (set: ISetLike<T>, addons: UpSetAddons<ISetLike<T>, T, any>) => {
    return function (this: any, evt: React.MouseEvent) {
      return f.call(
        this,
        set,
        evt.nativeEvent,
        addons.map((a) => (a.createOnHandlerData ? a.createOnHandlerData(set) : null))
      );
    };
  };
}

export function addonPositionGenerator(total: number, padding: number) {
  let beforeAcc = 0;
  let afterAcc = 0;
  return (addon: { position?: 'before' | 'after'; size: number }) => {
    let x = 0;
    if (addon.position === 'before') {
      beforeAcc += addon.size + padding;
      x = -beforeAcc;
    } else {
      x = total + afterAcc + padding;
      afterAcc += addon.size + padding;
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
