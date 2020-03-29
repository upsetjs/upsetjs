import { observable, action, runInAction } from 'mobx';
import datasets, { IDataSet } from '../data';
import { ISets } from '@upsetjs/model';

export default class Store {
  @observable
  readonly ui = {};

  @observable.shallow
  readonly datasets = datasets;

  @observable
  dataset: IDataSet | null = null;

  @observable.shallow
  sets: ISets<any> = [];

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
}
