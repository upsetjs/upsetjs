import { observable, action, runInAction } from 'mobx';
import datasets, { IDataSet } from '../data';
import { ISets } from '@upsetjs/model';

export default class Store {
  @observable
  readonly ui = {};

  @observable
  readonly datasets = datasets;

  @observable
  dataset: IDataSet | null = null;

  @observable
  sets: ISets<any> = [];

  @action
  selectDataSet(name: string) {
    this.dataset = this.datasets.find(d => d.name === name) ?? null;

    this.sets = [];
    if (this.dataset) {
      this.dataset.sets().then(sets =>
        runInAction(() => {
          this.sets = sets;
        })
      );
    }
  }
}
