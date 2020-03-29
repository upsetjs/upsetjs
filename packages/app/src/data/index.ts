import simpsons from './simpsons';
import upset from './upset2';
// eslint-disable-next-line import/no-webpack-loader-syntax
import '!file-loader?name=schema.1.0.0.json!./schema.jsonc';
import { listDatasets } from './db';
import { IDataSet } from './interfaces';

export * from './interfaces';

export default function list() {
  return Promise.all([simpsons, upset(), listDatasets()]).then((dss) => {
    return ([] as IDataSet[]).concat(...dss);
  });
}
