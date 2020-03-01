import { configure } from '@storybook/html';

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.(js|ts)x?$/), module);
