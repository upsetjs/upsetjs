import { observable, action, runInAction } from 'mobx';
import datasets, { IDataSet } from '../data';
import { ISets } from '@upsetjs/model';
import { fromPromise, IPromiseBasedObservable } from 'mobx-utils';

export default class Store {
  @observable
  readonly ui = {};

  @observable.shallow
  readonly datasets = datasets;

  @observable
  dataset: IDataSet | null = null;

  @observable.shallow
  sets: ISets<any> = [];

  @observable
  setsPromise: IPromiseBasedObservable<ISets<any>> = fromPromise(Promise.resolve([]));

  @action
  selectDataSet(name: string) {
    this.dataset = this.datasets.find((d) => d.name === name) ?? null;

    this.sets = [];
    const p = this.dataset?.sets() ?? Promise.resolve([]);
    this.setsPromise = fromPromise(p, this.setsPromise);
    p.then((sets) =>
      runInAction(() => {
        this.sets = sets;
      })
    );
  }
}
