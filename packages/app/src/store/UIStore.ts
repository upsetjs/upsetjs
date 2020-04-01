import { action, observable } from 'mobx';
import { createRef } from 'react';

export interface ISetTableOptions {
  order: 'asc' | 'desc';
  orderBy: 'name' | 'cardinality';
}
export interface IElemTableOptions {
  order: 'asc' | 'desc';
  orderBy: 'name';
}

export interface IToast {
  severity: 'error' | 'info' | 'warning' | 'success';
  message: string;
}

export default class UIStore {
  @observable
  readonly sidePanelExpanded = new Set<string>(['queries', 'options', 'sets', 'elems']);

  @observable
  readonly setTable: ISetTableOptions = {
    order: 'desc' as 'asc' | 'desc',
    orderBy: 'cardinality' as 'name' | 'cardinality',
  };
  @observable
  readonly elemTable = {
    order: 'asc' as 'asc' | 'desc',
    orderBy: 'name',
  };

  @observable
  speedDial = false;

  @observable
  readonly ref = createRef<SVGSVGElement>();

  @observable
  toast: IToast | null = null;

  @action
  setSpeedDial(value: boolean) {
    this.speedDial = value;
  }

  @action
  toggleSidePanelExpansion(id: string) {
    if (this.sidePanelExpanded.has(id)) {
      this.sidePanelExpanded.delete(id);
    } else {
      this.sidePanelExpanded.add(id);
    }
  }

  @action
  changeSetTableOptions(delta: Partial<ISetTableOptions>) {
    Object.assign(this.setTable, delta);
  }

  @action
  changeElemTableOptions(delta: Partial<IElemTableOptions>) {
    Object.assign(this.elemTable, delta);
  }

  @action.bound
  closeToast() {
    this.toast = null;
  }

  @action
  showToast(toast: IToast) {
    this.toast = toast;
  }
}
