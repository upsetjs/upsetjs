import { action, observable } from 'mobx';
import { createRef } from 'react';

export interface ISetTableOptions {
  order: 'asc' | 'desc';
  orderBy: 'name' | 'cardinality';
}

export default class UIStore {
  @observable
  readonly sidePanelExpanded = new Set<string>(['queries', 'options', 'sets']);

  @observable
  readonly setTable: ISetTableOptions = {
    order: 'desc' as 'asc' | 'desc',
    orderBy: 'cardinality' as 'name' | 'cardinality',
  };

  @observable
  speedDial = false;

  @observable
  readonly ref = createRef<SVGSVGElement>();

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
  changeTableOptions(delta: Partial<ISetTableOptions>) {
    Object.assign(this.setTable, delta);
  }
}
