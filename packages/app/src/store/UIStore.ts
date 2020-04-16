import { action, observable, autorun } from 'mobx';
import { createRef } from 'react';

export interface ISetTableOptions {
  order: 'asc' | 'desc';
  orderBy: 'name' | 'cardinality';
}
export interface IElemTableOptions {
  order: 'asc' | 'desc';
  orderBy: string;
}

export interface IToast {
  severity: 'error' | 'info' | 'warning' | 'success';
  message: string;
}

export default class UIStore {
  @observable
  readonly sidePanelExpanded = new Set<string>(
    (localStorage.getItem('sidePanel') || 'queries,options,sets,elems').split(',')
  );

  @observable
  menu = false;

  @observable
  zen = localStorage.getItem('zen') === 'T';

  @observable
  theme: 'dark' | 'light' = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';

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

  constructor() {
    autorun(() => {
      localStorage.setItem('theme', this.theme);
    });
    autorun(() => {
      localStorage.setItem('zen', this.zen ? 'T' : 'F');
    });
    autorun(() => {
      localStorage.setItem('sidePanel', Array.from(this.sidePanelExpanded).join(','));
    });
  }

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

  @action.bound
  toggleMenu() {
    this.menu = !this.menu;
  }

  @action.bound
  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }

  @action.bound
  toggleZen() {
    this.zen = !this.zen;
  }
}
