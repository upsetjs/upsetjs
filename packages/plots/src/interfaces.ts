/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */
import { ISetLike, UpSetQueries, getDefaultTheme as getReactDefaultTheme, UpSetThemeProps } from '@upsetjs/react';

export interface UpSetPlotThemeProps {
  selectionColor?: string;
  color?: string;
}

export declare type IUpSetSelection<T> = ISetLike<T> | ReadonlyArray<T> | null;

export interface UpSetPlotSelectionProps<T> {
  selection?: IUpSetSelection<T>;
  /**
   * mouse hover listener, triggered when the user is over a set (combination)
   */
  onHover?: (selection: IUpSetSelection<T>) => void;
  /**
   * mouse click listener, triggered when the user is clicking on a set (combination)
   */
  onClick?: (selection: IUpSetSelection<T>) => void;
  /**
   * mouse context menu listener, triggered when the user right clicks on a set (combination)
   */
  onContextMenu?: (selection: IUpSetSelection<T>) => void;
  /**
   * list of queries as an alternative to provide a single selection
   */
  queries?: UpSetQueries<T>;
}

export interface UpSetPlotStyleProps {
  theme?: 'light' | 'dark';

  title?: string;
  description?: string;
}

export interface UpSetPlotProps<T> extends UpSetPlotStyleProps, UpSetPlotThemeProps, UpSetPlotSelectionProps<T> {}

export interface UpSetPlotFullProps<T>
  extends Required<UpSetPlotStyleProps>,
    Required<UpSetThemeProps>,
    UpSetPlotSelectionProps<T> {}

export function fillDefaults<T>(props: UpSetPlotProps<T>): UpSetPlotFullProps<T> {
  return Object.assign(
    {
      theme: 'light',
      title: '',
      description: '',
    },
    getReactDefaultTheme(props.theme),
    props
  );
}
