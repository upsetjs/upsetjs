import { observable, action, runInAction } from 'mobx';
import datasets, { IDataSet } from '../data';
import { ISets, ISetLike } from '@upsetjs/model';

export default class Store {
  @observable
  readonly ui = {};

  @observable.shallow
  readonly datasets = datasets;

  @observable
  dataset: IDataSet | null = null;

  @observable.shallow
  sets: ISets<any> = [];

  @observable.ref
  hover: ISetLike<any> | null = null;
  @observable.ref
  selection: ISetLike<any> | null = null;

  @action
  selectDataSet(name: string) {
    this.dataset = this.datasets.find((d, i) => i.toString() === String(name) || d.name === name) ?? null;

    this.sets = [];
    const p = this.dataset?.sets() ?? Promise.resolve([]);
    p.then((sets) =>
      runInAction(() => {
        this.sets = sets;
      })
    );
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
