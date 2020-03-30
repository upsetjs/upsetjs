import { observable, action, runInAction, computed } from 'mobx';
import { IDataSet, listStatic, listRemote, listLocal, ICustomizeOptions } from '../data';
import { ISetLike, ISets, GenerateSetCombinationsOptions, generateCombinations, UpSetQuery } from '@upsetjs/model';
import { UpSetProps, fillDefaults, UpSetThemeProps, UpSetFontSizes } from '@upsetjs/react';
import { stableSort } from './utils';

export interface ISetTableOptions {
  order: 'asc' | 'desc';
  orderBy: 'name' | 'cardinality';
  page: number;
  rowsPerPage: number;
}

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
  'combinationName',
  'setName',
  'barLabelOffset',
  'setNameAxisOffset',
  'combinationNameAxisOffset',
  'heightRatios',
  'padding',
  'theme',
  'triangleSize',
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

export default class Store {
  @observable
  readonly ui = {
    sidePanelExpanded: new Set<string>(['options', 'sets']),
    setTable: {
      order: 'desc' as 'asc' | 'desc',
      orderBy: 'cardinality' as 'name' | 'cardinality',
    } as ISetTableOptions,
  };

  @observable.shallow
  readonly datasets: IDataSet[] = [];

  @observable.ref
  dataset: IDataSet | null = null;

  @observable.shallow
  sets: ISets<any> = [];

  @observable
  readonly props: Required<ICustomizeOptions> = extractDefaults((themeKeys as string[]).concat(otherOptionKeys));

  @observable.ref
  hover: ISetLike<any> | null = null;
  @observable.ref
  selection: ISetLike<any> | null = null;

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
    this.selectedSets = new Set();
    if (this.dataset) {
      this.dataset.load().then((d) =>
        runInAction(() => {
          this.sets = d.sets;
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
  readonly combinationsOptions: GenerateSetCombinationsOptions = {
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
    return generateCombinations(this.visibleSets, this.combinationsOptions);
  }

  @action
  changeCombinations(delta: Partial<GenerateSetCombinationsOptions>) {
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
    Object.assign(this.props.fontSizes, delta);
  }

  @action
  toggleSidePanelExpansion(id: string) {
    if (this.ui.sidePanelExpanded.has(id)) {
      this.ui.sidePanelExpanded.delete(id);
    } else {
      this.ui.sidePanelExpanded.add(id);
    }
  }

  @action
  changeTableOptions(delta: Partial<ISetTableOptions>) {
    Object.assign(this.ui.setTable, delta);
  }

  @computed
  get visibleQueries(): UpSetQuery<any>[] {
    if (!this.hover || !this.selection) {
      return [];
    }
    return [
      {
        name: 'Selected Set',
        color: 'darkorange',
        set: this.selection,
      },
    ];
  }
}
