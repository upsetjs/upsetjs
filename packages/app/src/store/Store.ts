import { observable, action, runInAction, computed } from 'mobx';
import UIStore from './UIStore';
import { IDataSet, listStatic, listRemote, listLocal, ICustomizeOptions } from '../data';
import { ISetLike, ISets, GenerateSetCombinationsOptions, generateCombinations, UpSetSetQuery } from '@upsetjs/model';
import { UpSetProps, fillDefaults, UpSetThemeProps, UpSetFontSizes } from '@upsetjs/react';
import { stableSort } from './utils';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { exportSVG, downloadUrl } from '@upsetjs/ui-utils';
import exportJSON from '../data/exportJSON';
import exportCSV from '../data/exportCSV';
import { exportCodepen, exportCodeSandbox, exportJSFiddle } from '../data/exportTools';

export interface ISetTableOptions {
  order: 'asc' | 'desc';
  orderBy: 'name' | 'cardinality';
  page: number;
  rowsPerPage: number;
}

const colors = [schemeCategory10[0], ...schemeCategory10.slice(2)]; // no orange
export const TEMP_QUERY_COLOR = colors.shift()!;

const themeKeys: (keyof UpSetThemeProps)[] = [
  'selectionColor',
  'color',
  'textColor',
  'hoverHintColor',
  'notMemberColor',
  'alternatingBackgroundColor',
];
const otherOptionKeys: (keyof UpSetProps<any>)[] = [
  'fontSizes',
  'barPadding',
  'dotPadding',
  'combinationName',
  'setName',
  'barLabelOffset',
  'setNameAxisOffset',
  'combinationNameAxisOffset',
  'heightRatios',
  'padding',
  'theme',
  'widthRatios',
  'fontFamily',
  'numericScale',
  'bandScale',
];

function extractTheme(theme: 'light' | 'dark') {
  const defaults: any = fillDefaults({
    theme,
    width: 100,
    height: 100,
    sets: [],
  });
  const r: UpSetThemeProps = {};
  for (const key of themeKeys) {
    r[key] = defaults[key];
  }
  return r as Required<UpSetThemeProps>;
}

function extractDefaults(keys: any[]) {
  const defaults: any = fillDefaults({
    theme: 'dark',
    width: 100,
    height: 100,
    sets: [],
  });
  const r: any = {};
  for (const key of keys) {
    r[key] = defaults[key];
  }
  return r;
}

export function stripDefaults(props: Required<ICustomizeOptions>) {
  const defaults = extractDefaults((themeKeys as string[]).concat(otherOptionKeys));
  const stripDefaultsImpl = (a: any, defaults: any) => {
    const r: any = {};
    for (const key of Object.keys(a)) {
      const defaultValue = defaults[key];
      const value = a[key];
      if (defaultValue === value) {
        continue;
      }
      r[key] = value;
    }
    return r;
  };
  const r: ICustomizeOptions = stripDefaultsImpl(props, defaults);
  if (r.fontSizes) {
    const sub = stripDefaultsImpl(r.fontSizes, defaults.fontSizes!);
    if (Object.keys(sub).length === 0) {
      delete r.fontSizes;
    } else {
      r.fontSizes = sub;
    }
  }
  if (Array.isArray(r.heightRatios) && r.heightRatios.every((v, i) => v === defaults.heightRatios[i])) {
    delete r.heightRatios;
  }
  if (Array.isArray(r.widthRatios) && r.widthRatios.every((v, i) => v === defaults.widthRatios[i])) {
    delete r.widthRatios;
  }
  return r;
}

class StoreQuery {
  @observable.ref
  q: UpSetSetQuery<any>;
  @observable
  visible: boolean;

  constructor(q: UpSetSetQuery<any>, visible: boolean) {
    this.q = q;
    this.visible = visible;
  }
}

export default class Store {
  @observable
  readonly ui = new UIStore();

  @observable.shallow
  readonly datasets: IDataSet[] = [];

  @observable.ref
  dataset: IDataSet | null = null;

  @observable.shallow
  sets: ISets<any> = [];

  @observable.shallow
  elems: ReadonlyArray<any> = [];

  @observable
  readonly props: Required<ICustomizeOptions> = extractDefaults((themeKeys as string[]).concat(otherOptionKeys));

  @observable.ref
  hover: ISetLike<any> | null = null;
  @observable.ref
  selection: ISetLike<any> | null = null;

  @observable
  readonly queries: StoreQuery[] = [];

  constructor() {
    this.appendDatasets(listStatic());
    listLocal().then((ds) => this.appendDatasets(ds));
    listRemote().then((ds) => {
      ds.forEach((d) => d.then((ds) => this.appendDatasets([ds])));
    });
  }

  @action
  private appendDatasets(ds: IDataSet[]) {
    if (ds.length <= 0) {
      return;
    }
    this.datasets.push(...ds);
    if (this.datasets.length > 0 && !this.dataset) {
      this.selectDataSet(this.datasets[0].name);
    }
  }

  @action
  selectDataSet(name: string) {
    this.dataset = this.datasets.find((d, i) => i.toString() === String(name) || d.name === name) ?? null;

    this.sets = [];
    this.elems = [];
    this.selectedSets = new Set();
    if (this.dataset) {
      this.dataset.load().then((d) =>
        runInAction(() => {
          this.sets = d.sets;
          this.elems = d.elems;
          Object.assign(this.props, d.props);
          this.selectedSets = new Set(this.sortedSets.slice(0, 5).map((d) => d.name));
        })
      );
    }
  }

  @action.bound
  setHover(set: ISetLike<any> | null) {
    this.hover = set;
  }

  @action.bound
  setSelection(set: ISetLike<any> | null) {
    this.selection = set;
  }

  @computed
  get visibleSets() {
    return this.sortedSets.filter((s) => this.selectedSets.has(s.name));
  }

  @observable
  readonly combinationsOptions: GenerateSetCombinationsOptions<any> = {
    type: 'intersection',
    min: 0,
    max: 3,
    empty: false,
    limit: 100,
    order: 'cardinality',
  };

  @observable
  selectedSets = new Set<string>();

  @computed
  get sortedSets() {
    return stableSort(this.sets, this.ui.setTable.orderBy, this.ui.setTable.order);
  }

  @action
  setSelectedSets(names: Set<string>) {
    this.selectedSets = names;
  }

  @computed
  get visibleCombinations() {
    return generateCombinations(
      this.visibleSets,
      Object.assign(
        {
          elems: this.elems,
        },
        this.combinationsOptions
      )
    );
  }

  @action
  changeCombinations(delta: Partial<GenerateSetCombinationsOptions<any>>) {
    Object.assign(this.combinationsOptions, delta);
  }

  @action
  changeProps(delta: ICustomizeOptions) {
    Object.assign(this.props, delta);
    if (delta.theme) {
      Object.assign(this.props, extractTheme(delta.theme));
    }
  }

  @action
  changeFontSize(delta: UpSetFontSizes) {
    this.props.fontSizes = Object.assign({}, this.props.fontSizes, delta);
  }

  @computed
  get visibleQueries(): UpSetSetQuery<any>[] {
    const qs = this.queries.filter((d) => d.visible).map((d) => d.q);
    if (!this.selection) {
      return qs;
    }
    return [
      {
        name: this.selection.name,
        color: TEMP_QUERY_COLOR,
        set: this.selection,
      },
    ].concat(qs);
  }

  @action
  deleteQuery(query: UpSetSetQuery<any>) {
    const i = this.queries.findIndex((d) => d.q === query);
    if (i >= 0) {
      this.queries.splice(i, 1);
      colors.unshift(query.color);
    }
  }
  @action
  persistSelection() {
    if (!this.selection) {
      return;
    }
    this.queries.push(
      new StoreQuery(
        {
          name: this.selection.name,
          set: this.selection,
          color: colors.length > 0 ? colors.shift()! : 'grey',
        },
        true
      )
    );
    this.selection = null;
  }

  @action
  toggleQueryVisibility(query: UpSetSetQuery<any>) {
    const q = this.queries.find((d) => d.q === query);
    if (!q) {
      return;
    }
    q.visible = !q.visible;
  }

  @computed
  get title() {
    return `UpSet - ${this.dataset?.name ?? 'Unknown'}`;
  }

  @action
  exportImage(type: 'svg' | 'png') {
    if (this.ui.ref.current) {
      exportSVG(this.ui.ref.current, {
        type,
        title: this.title,
        theme: this.props.theme,
      });
    }
  }

  @action.bound
  exportCSV() {
    const text = exportCSV(this);
    const b = new Blob([text], {
      type: 'text/csv',
    });
    const url = URL.createObjectURL(b);
    downloadUrl(url, `${this.title}.csv`, document);
    URL.revokeObjectURL(url);
  }

  @action.bound
  exportJSON() {
    const text = exportJSON(this);
    const b = new Blob([text], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(b);
    downloadUrl(url, `${this.title}.json`, document);
    URL.revokeObjectURL(url);
  }

  @action.bound
  exportCodepen() {
    exportCodepen(this);
  }
  @action.bound
  exportCodesandbox() {
    exportCodeSandbox(this);
  }
  @action.bound
  exportJSFiddle() {
    exportJSFiddle(this);
  }
}
