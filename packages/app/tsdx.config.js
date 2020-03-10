const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('rollup-plugin-pnp-resolve');
const copy = require('rollup-plugin-copy');

module.exports = {
  rollup(config, options) {
    delete config.external; // bundle full
    delete config.output.globals;
    config.plugins.splice(
      0,
      0,
      resolve(),
      commonjs({
        namedExports: {
          react: [
            'isValidElement',
            'Children',
            'Component',
            'PureComponent',
            'Fragment',
            'createElement',
            'cloneElement',
            'useCallback',
            'useMemo',
            'memo',
            'useRef',
            'useEffect',
            'forwardRef',
            'useImperativeHandle',
            'useState',
            'useLayoutEffect',
            'findDom',
          ],
          'react-dom': ['findDOMNode'],
          'react-is': ['ForwardRef'],
          'prop-types': ['elementType'],
        },
      })
    );
    config.plugins.push(
      copy({
        targets: [
          {
            src: 'src/index.html',
            dest: 'dist',
            rename: (name, extension) => `${name}${options.env === 'development' ? '.dev' : ''}.${extension}`,
            transform: contents => contents.toString().replace('__SCRIPT__', `upsetjs.umd.${options.env}.js`),
          },
        ],
      })
    );
    return config;
  },
};
