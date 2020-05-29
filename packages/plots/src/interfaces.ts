/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */
import { ISetLike, UpSetQueries } from '@upsetjs/react';

export interface UpSetPlotThemeProps {
  selectionColor?: string;
  color?: string;
}

export interface UpSetPlotProps<T> extends UpSetPlotThemeProps {
  theme?: 'light' | 'dark';

  selection?: ISetLike<T> | ReadonlyArray<T> | null;
  /**
   * mouse hover listener, triggered when the user is over a set (combination)
   */
  onHover?: (selection: ReadonlyArray<T> | null, evt: MouseEvent) => void;
  /**
   * mouse click listener, triggered when the user is clicking on a set (combination)
   */
  onClick?: (selection: ReadonlyArray<T> | null, evt: MouseEvent) => void;
  /**
   * mouse context menu listener, triggered when the user right clicks on a set (combination)
   */
  onContextMenu?: (selection: ReadonlyArray<T> | null, evt: MouseEvent) => void;
  /**
   * list of queries as an alternative to provide a single selection
   */
  queries?: UpSetQueries<T>;
}
