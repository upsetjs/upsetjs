import simpsons from './simpsons';
// eslint-disable-next-line import/no-webpack-loader-syntax
import '!file-loader?name=schema.1.0.0.json!./schema.jsonc';

export * from './interfaces';

export default [simpsons];
