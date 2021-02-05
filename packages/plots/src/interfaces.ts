/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */
import {
  UpSetSelection,
  UpSetQueries,
  getDefaultTheme as getReactDefaultTheme,
  UpSetThemeProps,
  ISetLike,
  UpSetThemes,
} from '@upsetjs/react';

export type { UpSetThemes } from '@upsetjs/react';

export interface UpSetPlotThemeProps {
  selectionColor?: string;
  color?: string;
}

export interface UpSetPlotSelectionProps<T> {
  selection?: UpSetSelection<T>;
  /**
   * mouse hover listener, triggered when the user is over a set (combination)
   */
  onHover?: (selection: ISetLike<T> | readonly T[] | null) => void;
  /**
   * mouse click listener, triggered when the user is clicking on a set (combination)
   */
  onClick?: (selection: ISetLike<T> | readonly T[] | null) => void;
  /**
   * list of queries as an alternative to provide a single selection
   */
  queries?: UpSetQueries<T>;
}

export interface UpSetPlotStyleProps {
  theme?: UpSetThemes;

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
