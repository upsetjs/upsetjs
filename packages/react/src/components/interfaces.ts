/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetLike } from '@upsetjs/model';

export declare type UpSetSelection = {
  onMouseEnter(selection: ISetLike<any>): ((evt: React.MouseEvent) => void) | undefined;
  onMouseLeave: ((evt: React.MouseEvent) => void) | undefined;
  onClick(selection: ISetLike<any>): ((evt: React.MouseEvent) => void) | undefined;
  onMouseMove(selection: ISetLike<any>): ((evt: React.MouseEvent) => void) | undefined;
  onContextMenu(selection: ISetLike<any>): ((evt: React.MouseEvent) => void) | undefined;
};
