import { observable, action, runInAction, computed } from 'mobx';
import listDataSets, { IDataSet } from '../data';
import { ISetLike, ISets, GenerateSetCombinationsOptions, generateCombinations, UpSetQuery } from '@upsetjs/model';
import { UpSetReactStyleProps, UpSetStyleProps } from '@upsetjs/react';
import { stableSort } from './utils';

export interface ISetTableOptions {
  order: 'asc' | 'desc';
  orderBy: 'name' | 'cardinality';
  page: number;
  rowsPerPage: number;
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
  datasets: IDataSet[] = [];

  @observable.ref
  dataset: IDataSet | null = null;

  @observable.shallow
  sets: ISets<any> = [];

  @observable.ref
  props: UpSetReactStyleProps & UpSetStyleProps = {};

  @observable.ref
  hover: ISetLike<any> | null = null;
  @observable.ref
  selection: ISetLike<any> | null = null;

  constructor() {
    listDataSets().then((r) =>
      runInAction(() => {
        this.datasets = r;
        this.selectDataSet(r[0].name);
      })
    );
  }

  @action
  selectDataSet(name: string) {
    this.dataset = this.datasets.find((d, i) => i.toString() === String(name) || d.name === name) ?? null;

    this.sets = [];
    this.props = {};
    this.selectedSets = new Set();
    if (this.dataset) {
      this.dataset.load().then((d) =>
        runInAction(() => {
          this.sets = d.sets;
          this.props = d.props;
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

  @computed
  get selectionColor() {
    return !this.hover && this.selection ? 'darkorange' : undefined;
  }
}
