import { observable, action, runInAction, computed } from 'mobx';
import listDataSets, { IDataSet } from '../data';
import { ISetLike, ISets, GenerateSetCombinationsOptions } from '@upsetjs/model';
import { UpSetReactStyleProps, UpSetStyleProps } from '@upsetjs/react';

export default class Store {
  @observable
  readonly ui = {};

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
    if (this.dataset) {
      this.dataset.load().then((d) =>
        runInAction(() => {
          this.sets = d.sets;
          this.props = d.props;
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
    return this.sets;
  }

  @observable
  readonly visibleCombinations: GenerateSetCombinationsOptions = {
    type: 'intersection',
    min: 0,
    max: 3,
    empty: false,
  };

  @action
  changeCombinations(delta: Partial<GenerateSetCombinationsOptions>) {
    Object.assign(this.visibleCombinations, delta);
    console.log({ ...this.visibleCombinations });
  }
}
