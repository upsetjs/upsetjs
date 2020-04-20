import { unparse, parse } from 'papaparse';
import Store from '../store/Store';
import { IDataSet, IElems, IAttrs } from './interfaces';
import { extractSets } from '@upsetjs/model';
import { boxplot } from '@upsetjs/math';

function computeAttrLabels(attr: string) {
  return ['Count', 'Median', 'Mean', 'Min', 'Max', 'Q1', 'Q3'].map((name) => `${attr}_${name}`);
}

function computeAttr(attr: string, elems: IElems) {
  const bs = boxplot(elems.map((elem) => elem.attrs[attr]));
  return [bs.count, bs.median, bs.mean, bs.min, bs.max, bs.q1, bs.q3];
}

export function exportCSV(store: Store) {
  const sets = store.visibleSets;
  const combinations = store.visibleCombinations;
  const attrs = store.dataset!.attrs.filter((d) => store.selectedAttrs.has(d));
  return unparse([
    ['Name', 'Cardinality', 'Degree', sets.map((d) => d.name), attrs.map((attr) => computeAttrLabels(attr))].flat(2),
    ...combinations.map((c) => {
      return [
        c.name,
        c.cardinality,
        c.degree,
        sets.map((s) => (c.sets.has(s) ? 1 : 0)),
        attrs.map((attr) => computeAttr(attr, c.elems)),
      ].flat(2);
    }),
  ]);
}

function isBoolean(v: any) {
  if (v === '' || v == null) {
    // cannot say
    return true;
  }
  if (typeof v === 'number') {
    return v === 1 || v === 0;
  }
  if (typeof v === 'string') {
    const l = v.toLowerCase();
    return l === 't' || l === 'f' || l === 'true' || l === 'false';
  }
  return false;
}

function isTrue(v: any) {
  if (v === '' || v == null) {
    return false;
  }
  if (typeof v === 'number') {
    return v === 1;
  }
  if (typeof v === 'string') {
    const l = v.toLowerCase();
    return l === 't' || l === 'true';
  }
  return false;
}

function determineSets(rows: any[], fields: string[]) {
  // set fields should be like numbers with just 0 and ones
  return fields.filter((f) => rows.every((row) => isBoolean(row[f])));
}

function determineAttrs(rows: any[], fields: string[]) {
  // attrs ... number fields
  return fields.filter((f) => rows.every((row) => typeof row[f] === 'number'));
}

function toAttrs(attrs: string[], e: any) {
  const r: IAttrs = {};
  attrs.forEach((attr) => (r[attr] = e[attr]));
  return r;
}

function deriveDataSetName(file: File | string) {
  let name: string = '';
  if (typeof file === 'string') {
    // url
    name = file.includes('/') ? file.slice(file.lastIndexOf('/') + 1) : file;
  } else {
    name = file.name;
  }
  return name.includes('.') ? name.slice(0, name.lastIndexOf('.')) : name;
}

function findNameAttr(fields: string[]) {
  const fs = fields.map((f) => f.toLowerCase());
  if (fs.includes('name')) {
    return fields[fs.indexOf('name')];
  }
  if (fs.includes('id')) {
    return fields[fs.indexOf('id')];
  }
  return fields[0]; // first one
}

export function importCSV(file: File | string): Promise<IDataSet> {
  const name = deriveDataSetName(file);
  return new Promise<IDataSet>((resolve) => {
    parse(file, {
      download: typeof file === 'string',
      dynamicTyping: true,
      header: true,
      complete(results) {
        const fields = results.meta.fields;
        const nameAttr = findNameAttr(fields);
        const setNames = determineSets(results.data, fields);
        const attrs = determineAttrs(
          results.data,
          fields.filter((d) => !setNames.includes(d) && d !== nameAttr)
        );
        resolve({
          id: name,
          name,
          creationDate: new Date(),
          author: 'User',
          description: `imported from ${name}`,
          attrs,
          load: () => {
            const elems: IElems = results.data.map((e, i) => ({
              name: (e[nameAttr] ?? i.toString()) as string,
              sets: setNames.filter((f) => isTrue(e[f])),
              attrs: toAttrs(attrs, e),
            }));
            return Promise.resolve({
              elems,
              sets: extractSets(elems),
            });
          },
        });
      },
    });
  });
}
