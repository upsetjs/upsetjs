/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2019-2022 Samuel Gratzl <sam@sgratzl.com>
 */

import { action, observable, autorun, computed, makeObservable } from 'mobx';
import { createRef } from 'react';

export interface ISetTableOptions {
  order: 'asc' | 'desc';
  orderBy: 'name' | 'cardinality';
}
export interface IElemTableOptions {
  order: 'asc' | 'desc';
  orderBy: string;
}

export interface IToastLink {
  href: string;
  alt: string | React.ReactNode;
}

export interface IToast {
  severity: 'error' | 'info' | 'warning' | 'success';
  message: string | React.ReactNode;
  link?: IToastLink;
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
  defaultTheme: 'dark' | 'light' | null = null;

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

  @observable
  visXAttr: string | null = null;
  @observable
  visYAttr: string | null = null;

  constructor() {
    makeObservable(this);
    autorun(() => {
      localStorage.setItem('zen', this.zen ? 'T' : 'F');
    });
    autorun(() => {
      localStorage.setItem('sidePanel', Array.from(this.sidePanelExpanded).join(','));
    });
  }

  @computed
  get theme() {
    return this.defaultTheme ?? 'light';
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
    this.defaultTheme = this.defaultTheme === 'dark' ? 'light' : 'dark';
  }

  @action.bound
  toggleZen() {
    this.zen = !this.zen;
  }

  @action
  setVisXAttr(attr: string | null) {
    this.visXAttr = attr ? attr : null;
  }

  @action
  setVisYAttr(attr: string | null) {
    this.visYAttr = attr ? attr : null;
  }
}
