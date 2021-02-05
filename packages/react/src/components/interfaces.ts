/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISetLike } from '@upsetjs/model';
import type { UpSetAddons } from '../interfaces';

export declare type UpSetSelection = {
  onMouseEnter(
    selection: ISetLike<any>,
    addons: UpSetAddons<ISetLike<any>, any, any>
  ): ((evt: React.MouseEvent) => void) | undefined;
  onMouseLeave: ((evt: React.MouseEvent) => void) | undefined;
  onClick(
    selection: ISetLike<any>,
    addons: UpSetAddons<ISetLike<any>, any, any>
  ): ((evt: React.MouseEvent) => void) | undefined;
  onMouseMove(
    selection: ISetLike<any>,
    addons: UpSetAddons<ISetLike<any>, any, any>
  ): ((evt: React.MouseEvent) => void) | undefined;
  onContextMenu(
    selection: ISetLike<any>,
    addons: UpSetAddons<ISetLike<any>, any, any>
  ): ((evt: React.MouseEvent) => void) | undefined;
};
