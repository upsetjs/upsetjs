import { addParameters } from '@storybook/react';
import React from 'react';
import { Title, Subtitle, Description, Props, Stories } from '@storybook/addon-docs/blocks';

addParameters({
  docs: {
    page: () =>
      React.createElement(React.Fragment, {}, [
        React.createElement(Title, {}),
        React.createElement(Subtitle, {}),
        React.createElement(Description, {}),
        // React.createElement(Source, {}),
        React.createElement(Props, {}),
        // React.createElement(Primary, {}),
        React.createElement(Stories, { includePrimary: true }),
      ]),
  },
});
