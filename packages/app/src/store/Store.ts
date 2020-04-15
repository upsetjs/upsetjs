import { observable, action, autorun, runInAction, computed } from 'mobx';
import UIStore from './UIStore';
import {
  IDataSet,
  listStatic,
  listRemote,
  deleteLocal,
  listLocal,
  ICustomizeOptions,
  saveLocal,
  IElem,
  IElems,
} from '../data';
import {
  ISetLike,
  ISets,
  GenerateSetCombinationsOptions,
  generateCombinations,
  UpSetSetQuery,
  ISet,
  ISetCombination,
} from '@upsetjs/model';
import {
  UpSetProps,
  fillDefaults,
  UpSetThemeProps,
  UpSetFontSizes,
  UpSetAddon,
  exportSVG,
  downloadUrl,
} from '@upsetjs/react';
import { boxplotAddon } from '@upsetjs/addons';
import { stableSort } from './utils';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { exportJSON, importJSON } from '../data/exportJSON';
import { exportCSV, importCSV } from '../data/exportCSV';
import { exportCodepen, exportCodeSandbox, exportJSFiddle } from '../data/exportTools';
import shareEmbedded from '../data/shareEmbedded';

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
const otherOptionKeys: (keyof UpSetProps<IElem>)[] = [
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

function extractDefaults(keys: any[], theme: 'dark' | 'light') {
  const defaults: any = fillDefaults({
    theme,
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

export function stripDefaults(props: Required<ICustomizeOptions>, theme: 'dark' | 'light') {
  const defaults = extractDefaults((themeKeys as string[]).concat(otherOptionKeys), theme);
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
  q: UpSetSetQuery<IElem>;
  @observable
  visible: boolean;

  constructor(q: UpSetSetQuery<IElem>, visible: boolean) {
    this.q = q;
    this.visible = visible;
  }
}

export default class Store {
  @observable
  readonly ui = new UIStore();

  @observable.shallow
  datasets: IDataSet[] = [];

  @observable.ref
  dataset: IDataSet | null = null;

  @observable.shallow
  sets: ISets<IElem> = [];

  @observable.shallow
  elems: IElems = [];

  @observable
  readonly props: Required<ICustomizeOptions> = extractDefaults(
    (themeKeys as string[]).concat(otherOptionKeys),
    this.ui.theme
  );

  @observable.ref
  hover: ISetLike<IElem> | null = null;
  @observable.ref
  selection: ISetLike<IElem> | null = null;

  @observable
  readonly queries: StoreQuery[] = [];

  @observable
  selectedAttrs = new Set<string>();

  constructor() {
    this.appendDatasets(listStatic());
    listLocal().then((ds) => this.appendDatasets(ds));
    listRemote().then((ds) => {
      ds.forEach((d) => d.then((ds) => this.appendDatasets([ds])));
    });

    autorun(() => {
      Object.assign(this.props, extractDefaults((themeKeys as string[]).concat(otherOptionKeys), this.ui.theme));
    });
  }

  @action.bound
  resetProps() {
    Object.assign(this.props, extractDefaults((themeKeys as string[]).concat(otherOptionKeys), this.ui.theme));
  }

  @action
  private appendDatasets(ds: IDataSet[]) {
    if (ds.length <= 0) {
      return;
    }
    this.datasets.push(...ds);
    this.sortDatasets();
    if (this.datasets.length > 0 && !this.dataset) {
      this.loadDataSet(this.datasets[0]);
    }
  }

  private sortDatasets() {
    this.datasets = this.datasets.slice().sort((a, b) => {
      if (a.id === 'simpsons') {
        return -1;
      }
      if (b.id === 'simpsons') {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });
  }

  @action
  selectDataSet(id: string) {
    const ds = this.datasets.find((d) => d.id === id) ?? null;
    this.loadDataSet(ds);
  }

  @action.bound
  private pushDataSet(dataset: IDataSet) {
    this.datasets.push(dataset);
    this.sortDatasets();
    this.dataset = dataset;
    this.loadDataSet(dataset, () => {
      saveLocal(this).then((stored) => {
        this.dataset = stored;
        this.datasets.splice(this.datasets.indexOf(dataset), 1, stored);
      });
    });
    this.ui.showToast({
      severity: 'success',
      message: 'Data set loaded',
    });
  }

  @action
  deleteDataSet(dataset: IDataSet) {
    if (!dataset.uid) {
      return;
    }
    deleteLocal(dataset).then(() =>
      runInAction(() => {
        this.datasets.splice(this.datasets.indexOf(dataset), 1);
        if (this.dataset === dataset) {
          this.loadDataSet(this.datasets[0]!);
        }
        this.ui.showToast({
          severity: 'success',
          message: 'Data set deleted',
        });
      })
    );
  }

  private loadDataSet(dataset: IDataSet | null, done?: () => void) {
    this.dataset = dataset;
    this.sets = [];
    this.elems = [];
    this.selectedSets = new Set();
    this.hover = null;
    this.selection = null;
    this.queries.splice(0, this.queries.length);

    if (!this.dataset) {
      return;
    }
    this.dataset.load().then((d) =>
      runInAction(() => {
        this.sets = d.sets;
        this.elems = d.elems;
        Object.assign(this.props, d.props ?? {});
        Object.assign(this.combinationsOptions, d.combinations ?? {});
        this.selectedSets = new Set(this.sortedSets.slice(0, 5).map((d) => d.name));
        if (done) {
          done();
        }
      })
    );
  }

  @action.bound
  setHover(set: ISetLike<IElem> | null) {
    this.hover = set;
  }

  @action.bound
  setSelection(set: ISetLike<IElem> | null) {
    this.selection = set;
  }

  @computed
  get visibleSets() {
    return this.sortedSets.filter((s) => this.selectedSets.has(s.name));
  }

  @computed
  get visibleSetAddons(): ReadonlyArray<UpSetAddon<ISet<IElem>, IElem>> {
    if (!this.dataset) {
      return [];
    }
    return this.dataset.attrs
      .filter((d) => this.selectedAttrs.has(d))
      .map((attr) => boxplotAddon((v) => v.attrs[attr], this.elems, { name: attr, theme: this.props.theme }));
  }

  @computed
  get visibleCombinationAddons(): ReadonlyArray<UpSetAddon<ISetCombination<IElem>, IElem>> {
    if (!this.dataset) {
      return [];
    }
    return this.dataset.attrs
      .filter((d) => this.selectedAttrs.has(d))
      .map((attr) =>
        boxplotAddon((v) => v.attrs[attr], this.elems, {
          orient: 'vertical',
          name: attr,
          theme: this.props.theme,
        })
      );
  }

  @computed
  get sortedSelectedElems() {
    if (!this.selection) {
      return [];
    }
    const o = this.ui.elemTable.orderBy;
    return stableSort<IElem>(
      this.selection.elems,
      o.startsWith('attrs') ? (v) => v.attrs[o.slice(6)] : (o as keyof IElem),
      this.ui.elemTable.order
    );
  }

  @observable
  readonly combinationsOptions: GenerateSetCombinationsOptions<IElem> = {
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

  @action
  setSelectedAttrs(names: Set<string>) {
    this.selectedAttrs = names;
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
  get visibleQueries(): UpSetSetQuery<IElem>[] {
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
  deleteQuery(query: UpSetSetQuery<IElem>) {
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
  toggleQueryVisibility(query: UpSetSetQuery<IElem>) {
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
  @action.bound
  sharedEmbedded() {
    shareEmbedded(this);
  }
  @action.bound
  importFile(file: File) {
    if (file.name.endsWith('.json')) {
      importJSON(file).then((ds) => this.pushDataSet(ds));
    } else if (file.name.endsWith('.csv')) {
      importCSV(file).then((ds) => this.pushDataSet(ds));
    }
  }
}
