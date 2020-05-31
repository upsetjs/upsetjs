/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { observable, action, autorun, runInAction, computed } from 'mobx';
import UIStore, { IToastLink } from './UIStore';
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
  isSetLike,
} from '@upsetjs/model';
import {
  fillDefaults,
  UpSetThemeProps,
  UpSetFontSizes,
  UpSetAddon,
  exportSVG,
  exportVegaLite,
  downloadUrl,
} from '@upsetjs/react';
import { boxplotAddon } from '@upsetjs/addons';
import { stableSort } from './utils';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { exportStaticJSON, exportJSON, importJSON } from '../data/exportJSON';
import { exportCSV, importCSV } from '../data/exportCSV';
import exportR from '../data/exportR';
import exportPython from '../data/exportPython';
import { exportCodepen, exportCodeSandbox, exportJSFiddle } from '../data/exportTools';
import shareEmbedded, { MAX_URL_LENGTH } from '../data/shareEmbedded';

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
const otherOptionKeys: string[] = [
  'padding',
  'barPadding',
  'dotPadding',
  'widthRatios',
  'heightRatios',

  'fontSizes',
  'combinationName',
  'setName',
  'barLabelOffset',
  'setNameAxisOffset',
  'combinationNameAxisOffset',
  'theme',
  'fontFamily',
  'numericScale',
  'bandScale',
  '',
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

  @observable
  readonly combinationsOptions: GenerateSetCombinationsOptions<IElem> & {
    type: 'intersection' | 'union';
    min: number;
    max: number;
    empty: boolean;
    limit: number;
  } = {
    type: 'intersection',
    min: 1,
    max: 5,
    empty: false,
    limit: 100,
    order: ['cardinality', 'name'],
  };

  @observable
  selectedSets = new Set<string>();

  constructor() {
    this.appendDatasets(listStatic());
    this.ui.showToast({
      severity: 'info',
      message: 'Preparing Datasets...',
    });
    Promise.all([
      listLocal().then((ds) => this.appendDatasets(ds)),
      listRemote().then((ds) => {
        ds.forEach((d) => d.then((ds) => this.appendDatasets([ds])));
      }),
    ]).then(() => {
      this.ui.closeToast();
      this.syncHistory();
    });

    autorun(() => {
      Object.assign(this.props, extractDefaults((themeKeys as string[]).concat(otherOptionKeys), this.ui.theme));
    });

    autorun(() => {
      // sync document title
      document.title = this.title;
    });
  }

  private syncHistory() {
    const onURLChangeImpl = (firstRun = false) => {
      const url = new URL(window.location.href);
      if (url.searchParams.has('ds')) {
        const id = decodeURIComponent(url.searchParams.get('ds')!);
        if (firstRun && id.startsWith('http')) {
          // URL mode
          this.importFile(id);
        } else if (this.dataset?.id !== id) {
          this.selectDataSet(id);
        }
      }
    };
    const onURLChange = onURLChangeImpl.bind(this, false);

    window.addEventListener('popstate', onURLChange);
    onURLChangeImpl(true);

    autorun(() => {
      const params = new URLSearchParams();
      if (this.dataset) {
        params.set('ds', encodeURIComponent(this.dataset.id));
      }
      params.sort();
      const current = new URL(window.location.href);
      if (current.searchParams.toString() !== params.toString()) {
        current.search = `?${params.toString()}`;
        window.removeEventListener('popstate', onURLChange);
        window.history.pushState(null, '', current.toString());
        window.addEventListener('popstate', onURLChange);
      }
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
      if (a.id === 'got') {
        return -1;
      }
      if (b.id === 'got') {
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
    // select first by default
    this.selectedAttrs = new Set(dataset ? dataset.attrs.slice(0, 1) : []);
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
  setHover(set: ISetLike<IElem> | null, evt: MouseEvent) {
    if (!set || !this.selection || !evt.ctrlKey) {
      this.hover = set;
      return;
    }
    // hover to the set but the set which is an intersection of all of them.
    // Thus it is simpler to find intersecting ones
    const sets = new Set<ISet<IElem>>();
    if (set.type === 'set') {
      sets.add(set);
    } else {
      set.sets.forEach((s) => sets.add(s));
    }
    if (this.selection.type === 'set') {
      sets.add(this.selection);
    } else if (isSetLike(this.selection)) {
      this.selection.sets.forEach((s) => sets.add(s));
    }
    if (sets.size === 1) {
      this.hover = set;
      return;
    }
    const intersection = this.visibleCombinations.find(
      (s) => s.degree === sets.size && Array.from(s.sets).every((s) => sets.has(s))
    );
    if (intersection) {
      this.hover = intersection;
    } else {
      this.hover = set;
    }
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
  get visibleSetAddons(): ReadonlyArray<UpSetAddon<ISet<IElem>, IElem, React.ReactNode>> {
    if (!this.dataset) {
      return [];
    }
    return this.dataset.attrs
      .filter((d) => this.selectedAttrs.has(d))
      .map((attr) => boxplotAddon((v) => v.attrs[attr], this.elems, { name: attr }));
  }

  @computed
  get visibleCombinationAddons(): ReadonlyArray<UpSetAddon<ISetCombination<IElem>, IElem, React.ReactNode>> {
    if (!this.dataset) {
      return [];
    }
    return this.dataset.attrs
      .filter((d) => this.selectedAttrs.has(d))
      .map((attr) =>
        boxplotAddon((v) => v.attrs[attr], this.elems, {
          orient: 'vertical',
          name: attr,
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
    return this.queries.filter((d) => d.visible).map((d) => d.q);
  }

  @computed
  get queriesAndSelection(): UpSetSetQuery<IElem>[] {
    const qs = this.visibleQueries;
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
    return `UpSet.js - ${this.dataset?.name ?? 'Unknown'}`;
  }

  @action.bound
  exportSVG() {
    if (this.ui.ref.current) {
      exportSVG(this.ui.ref.current, {
        type: 'svg',
        title: this.title,
      });
    }
  }

  @action.bound
  exportPNG() {
    if (this.ui.ref.current) {
      exportSVG(this.ui.ref.current, {
        type: 'png',
        title: this.title,
      });
    }
  }

  @action.bound
  exportVega() {
    if (this.ui.ref.current) {
      exportVegaLite(this.ui.ref.current, {
        title: this.title,
      });
      this.ui.showToast({
        severity: 'success',
        message: `${this.title}.json generated`,
        link: {
          alt: 'Vega-Lite Editor',
          href: 'https://vega.github.io/',
        },
      });
    }
  }

  private downloadFile(text: string, mimeType: string, extension: string, link?: IToastLink) {
    const b = new Blob([text], {
      type: mimeType,
    });
    const url = URL.createObjectURL(b);
    downloadUrl(url, `${this.title}.${extension}`, document);
    URL.revokeObjectURL(url);
    this.ui.showToast({
      severity: 'success',
      message: `${this.title}.${extension} generated`,
      link,
    });
  }

  @action.bound
  exportCSV() {
    this.downloadFile(exportCSV(this), 'text/csv', 'csv');
  }

  @action.bound
  exportJSON() {
    this.downloadFile(exportJSON(this), 'application/json', 'json');
  }
  @action.bound
  exportStaticJSON() {
    this.downloadFile(exportStaticJSON(this), 'application/json', 'json');
  }

  @action.bound
  exportR() {
    this.downloadFile(exportR(this), 'text/plain', 'R', {
      href: 'https://mybinder.org/v2/gh/upsetjs/upsetjs_r/master?urlpath=rstudio/',
      alt: 'Open MyBinder R Environment',
    });
  }

  @action.bound
  exportPython() {
    this.downloadFile(exportPython(this), 'application/vnd.jupyter', 'ipynb', {
      href: 'https://mybinder.org/v2/gh/upsetjs/upsetjs_jupyter_widget/master?urlpath=lab/',
      alt: 'Open MyBinder Python Environment',
    });
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
    const inline = shareEmbedded(this);
    if (!inline) {
      this.ui.showToast({
        severity: 'warning',
        message: `The current dataset cannot be encoded within ${MAX_URL_LENGTH.toLocaleString()} characters in the URL. You can either try to deactive any attriubtes or save the page and host it yourself`,
      });
    }
  }
  @action.bound
  importFile(file: File | string) {
    const name = typeof file == 'string' ? file : file.name;
    this.ui.showToast({
      severity: 'info',
      message: `Importing Dataset: ${name}...`,
    });
    const loader = name.endsWith('.json') ? importJSON : name.endsWith('.csv') ? importCSV : null;

    if (!loader) {
      this.ui.showToast({
        severity: 'error',
        message: 'Unknown Dataset type: only .csv and .json are supported',
      });
      return;
    }
    loader(file)
      .then((ds) => {
        this.ui.closeToast();
        this.pushDataSet(ds);
      })
      .catch((error) => {
        console.error(error);
        this.ui.showToast({
          severity: 'error',
          message: 'Error occurred during dataset import!',
        });
      });
  }
}
