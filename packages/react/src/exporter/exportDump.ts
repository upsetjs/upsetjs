import { UpSetProps } from '../interfaces';
import { UpSetDataInfo } from '../components/deriveDataDependent';
import { toUpSetJSDump } from '../dump';
import {
  toDump,
  isElemQuery,
  isSetQuery,
  UpSetElemQuery,
  UpSetSetQuery,
  validators,
  GenerateSetCombinationsOptions,
} from '@upsetjs/model';
import { downloadUrl } from './exportSVG';

export function exportDumpData(props: UpSetProps<any>, data: UpSetDataInfo<any>) {
  const elems: any[] = [];
  const lookup = new Map<any, number>();
  const toElemIndex = (elem: any) => {
    if (lookup.has(elem)) {
      return lookup.get(elem)!;
    }
    lookup.set(elem, elems.length);
    elems.push(elem);
    return elems.length - 1;
  };
  const dump = toDump(
    {
      sets: props.sets,
      queries: props.queries?.filter((d): d is UpSetElemQuery | UpSetSetQuery => isElemQuery(d) || isSetQuery(d)) ?? [],
      toElemIndex,
      selection: props.selection && validators.isSetLike(props.selection) ? props.selection : undefined,
      combinations: data.cs.v,
      combinationOptions: Array.isArray(props.combinations)
        ? {}
        : (props.combinations as GenerateSetCombinationsOptions<any>),
    },
    {
      compress: 'no',
    }
  );

  return toUpSetJSDump(dump, elems, props);
}
export function exportDump(svg: SVGSVGElement, props: UpSetProps<any>, data: UpSetDataInfo<any>) {
  const dump = exportDumpData(props, data);
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(dump, null, 2)], {
      type: 'application/json',
    })
  );
  downloadUrl(url, `${dump.name}.json`, svg.ownerDocument!);
  URL.revokeObjectURL(url);
}
