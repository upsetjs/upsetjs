import { UpSetLayoutProps, UpSetStyleProps, UpSetThemeProps, UpSetProps, UpSetFontSizes } from '../interfaces';
import { IUpSetDump, IUpSetStaticDump } from '@upsetjs/model';
import { fillDefaults } from '../fillDefaults';
import { FONT_SIZES_KEYS } from '../defaults';

export interface UpSetDumpProps
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

const DUMP_KEYS: (keyof UpSetDumpProps)[] = ['bandScale', 'numericScale'].concat(
  THEME_KEYS as string[],
  LAYOUT_KEYS as string[],
  STYLE_KEYS as string[]
) as (keyof UpSetDumpProps)[];

export interface IUpSetJSDump extends IUpSetDump {
  $schema: string;
  name: string;
  description: string;
  author?: string;

  elements: ReadonlyArray<number | string | any>;
  attrs: ReadonlyArray<string>;
  props: UpSetDumpProps;
}

function toDumpProps(props: UpSetProps): UpSetDumpProps {
  const full = fillDefaults({
    width: 0,
    height: 0,
    sets: props.sets,
    combinations: props.combinations,
    theme: props.theme,
  });

  const r: any = {};
  for (const key of DUMP_KEYS) {
    const value = props[key];
    const defaultValue = full[key];
    if (key === 'theme' && value === 'dark') {
      // keep dark theme flag
      r[key] = value;
      continue;
    }
    if (value == null || value === defaultValue) {
      continue;
    }
    if (key === 'fontSizes') {
      // nested check
      let empty = true;
      const sub: UpSetFontSizes = {};
      for (const fKey of FONT_SIZES_KEYS) {
        const fValue = (value as UpSetFontSizes)[fKey];
        const fDefaultValue = (defaultValue as UpSetFontSizes)[fKey];
        if (fValue !== fDefaultValue) {
          sub[fKey] = fValue;
          empty = false;
        }
      }
      if (!empty) {
        r[key] = sub;
      }
    } else {
      r[key] = value;
    }
  }
  return r;
}

export function toUpSetJSDump(
  dump: IUpSetDump,
  elements: ReadonlyArray<number | string | any>,
  props: UpSetProps<any>,
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
  props: UpSetDumpProps;
}

export function toUpSetJSStaticDump(
  dump: IUpSetStaticDump,
  props: UpSetProps<any>,
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
