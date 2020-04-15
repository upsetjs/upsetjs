# UpSet.js App

[![NPM Package][npm-image]][npm-url] [![Github Actions][github-actions-image]][github-actions-url]

This package is part of the UpSet.js ecosystem located at the main [Github Monorepo](https://github.com/upsetjs/upsetjs).

It contains a sample application for exploring sets and set intersections. It is the counterpart to the original [UpSet](http://vcg.github.io/upset/about/) and [UpSet2](https://vdl.sci.utah.edu/upset2/). The app is deployed at https://upsetjs.netlify.app.

![upset_app1](https://user-images.githubusercontent.com/4129778/79368561-e3d8c680-7f4f-11ea-9a87-f4421a3846cf.png)

## Features

- load one of the predefined datasets from [UpSet2](https://vdl.sci.utah.edu/upset2/)
- import CSV files to create additional datasets. Note: the datasets are stored in your local browser only. No data will be transferred to any server
- download as
  - PNG/SVG file
  - CSV File (set intersection as rows, sets as columns)
  - UpSet.js JSON dump file (can be reimported with the whole state)
- export to
  - [Codepen](https://codepen.io) with all data and settings
  - [Codesandbox](https://codesandbox.io) with all data and settings
  - [JSFiddle](https://jsfiddle.org) with all data and settings
- generate a shareable page that can be shared and saved in a self contained way
- toggle between light and dark theme
- customize UpSet plot (layout, fonts, colors, ...)
- customize Set selection (which sets, ordering)
- customize Set combination generation (mode: intersection or union, min, max, ordering, ...)
- save persistent queries based on clicked elements
- show box plots along the bars for numerical attributes

## Screenshots

![upset_app_export](https://user-images.githubusercontent.com/4129778/79368559-e2a79980-7f4f-11ea-8f0b-f567c702b2e8.png)

![upset_app_query](https://user-images.githubusercontent.com/4129778/79368555-e20f0300-7f4f-11ea-8254-0aaf6c6caf0f.png)

![upset_app_boxplots](https://user-images.githubusercontent.com/4129778/79371087-184e8180-7f54-11ea-9275-51ad3f58deca.png)

## License

### Commercial license

If you want to use Upset.js for a commercial application the commercial license is the appropriate license. Contact [@sgratzl](mailto:sam@sgratzl.com) for details.

### Open-source license

This library is released under the `GNU AGPLv3` version to be used for private and academic purposes. In case of a commercial use, please get in touch regarding a commercial license.

[npm-image]: https://badge.fury.io/js/@upsetjs/react.svg
[npm-url]: https://npmjs.org/package/@upsetjs/react
[github-actions-image]: https://github.com/sgratzl/upsetjs/workflows/nodeci/badge.svg
[github-actions-url]: https://github.com/sgratzl/upsetjs/actions
