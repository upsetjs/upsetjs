/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */
import {
  UpSetLayoutProps,
  UpSetStyleProps,
  UpSetThemeProps,
  UpSetProps,
  UpSetFontSizes,
  VennDiagramFontSizes,
} from '../interfaces';
import { IUpSetDump, IUpSetStaticDump } from '@upsetjs/model';
import { fillDefaults } from '../fillDefaults';
import { FONT_SIZES_KEYS } from '../defaults';

export interface UpSetJSDumpProps
  extends Partial<UpSetLayoutProps>,
    UpSetThemeProps,
    Omit<UpSetStyleProps<string>, 'title' | 'description'> {
  numericScale?: 'linear' | 'log';
  bandScale?: 'band';
}

const THEME_KEYS: (keyof UpSetThemeProps)[] = [
  'selectionColor',
  'color',
  'textColor',
  'hoverHintColor',
  'notMemberColor',
  'alternatingBackgroundColor',
];
const LAYOUT_KEYS: (keyof UpSetLayoutProps)[] = ['padding', 'barPadding', 'dotPadding', 'widthRatios', 'heightRatios'];
const STYLE_KEYS: (keyof UpSetStyleProps<any>)[] = [
  'fontSizes',
  'combinationName',
  'setName',
  'barLabelOffset',
  'setNameAxisOffset',
  'combinationNameAxisOffset',
  'theme',
  'fontFamily',
  'emptySelection',
  'exportButtons',
  'queryLegend',
];

const DUMP_KEYS: (keyof UpSetJSDumpProps)[] = ['bandScale', 'numericScale'].concat(
  THEME_KEYS as string[],
  LAYOUT_KEYS as string[],
  STYLE_KEYS as string[]
) as (keyof UpSetJSDumpProps)[];

export interface IUpSetJSDump extends IUpSetDump {
  $schema: string;
  name: string;
  description: string;
  author?: string;

  elements: ReadonlyArray<number | string | any>;
  attrs: ReadonlyArray<string>;
  props: UpSetJSDumpProps;
}

function toDumpProps(props: Partial<UpSetProps<any>>): UpSetJSDumpProps {
  const full = fillDefaults({
    width: 0,
    height: 0,
    sets: props.sets ?? [],
    combinations: props.combinations,
    theme: props.theme,
  });

  const r: any = {};
  DUMP_KEYS.forEach((key) => {
    const value = props[key];
    const defaultValue = full[key];
    if (key === 'theme' && value === 'dark') {
      // keep dark theme flag
      r[key] = value;
      return;
    }
    if (value == null || value === defaultValue) {
      return;
    }
    if (key === 'fontSizes') {
      // nested check
      let empty = true;
      const sub: UpSetFontSizes | VennDiagramFontSizes = {};
      FONT_SIZES_KEYS.forEach((fKey) => {
        const fValue = (value as UpSetFontSizes | VennDiagramFontSizes)[fKey];
        const fDefaultValue = (defaultValue as UpSetFontSizes | VennDiagramFontSizes)[fKey];
        if (fValue !== fDefaultValue) {
          sub[fKey] = fValue;
          empty = false;
        }
      });
      if (!empty) {
        r[key] = sub;
      }
    } else {
      r[key] = value;
    }
  });
  return r;
}

export function toUpSetJSDump(
  dump: IUpSetDump,
  elements: ReadonlyArray<number | string | any>,
  props: Partial<UpSetProps<any>>,
  author?: string
): IUpSetJSDump {
  return Object.assign(
    {
      $schema: 'https://upset.js.org/schema.1.0.0.json',
      name: typeof props.title === 'string' ? props.title : 'UpSetJS',
      description: typeof props.description === 'string' ? props.description : '',
      author,
      elements,
      attrs: [],
      props: toDumpProps(props),
    },
    dump
  );
}

export interface IUpSetJSStaticDump extends IUpSetStaticDump {
  $schema: string;
  name: string;
  description: string;
  author?: string;
  props: UpSetJSDumpProps;
}

export function toUpSetJSStaticDump(
  dump: IUpSetStaticDump,
  props: Partial<UpSetProps<any>>,
  author?: string
): IUpSetJSStaticDump {
  return Object.assign(
    {
      $schema: 'https://upset.js.org/schema-static.1.0.0.json',
      name: typeof props.title === 'string' ? props.title : 'UpSetJS',
      description: typeof props.description === 'string' ? props.description : '',
      author,
      props: toDumpProps(props),
    },
    dump
  );
}
