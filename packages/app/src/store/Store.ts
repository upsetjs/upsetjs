import { observable, action, runInAction } from 'mobx';
import listDataSets, { IDataSet, ILoadedDataSet } from '../data';
import { ISetLike } from '@upsetjs/model';

export default class Store {
  @observable
  readonly ui = {};

  @observable.shallow
  datasets: IDataSet[] = [];

  @observable.ref
  dataset: IDataSet | null = null;

  @observable.ref
  props: ILoadedDataSet | null = null;

  @observable.ref
  hover: ISetLike<any> | null = null;
  @observable.ref
  selection: ISetLike<any> | null = null;

  constructor() {
    listDataSets().then((r) =>
      runInAction(() => {
        this.datasets = r;
      })
    );
  }

  @action
  selectDataSet(name: string) {
    this.dataset = this.datasets.find((d, i) => i.toString() === String(name) || d.name === name) ?? null;

    this.props = null;
    if (this.dataset) {
      this.dataset.load().then((props) => runInAction(() => (this.props = props)));
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
}
