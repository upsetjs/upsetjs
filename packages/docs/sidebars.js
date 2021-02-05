module.exports = {
  someSidebar: [
    {
      type: 'category',
      label: 'UpSet.js',
      items: ['_index', 'design-principles'],
    },
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      items: ['getting-started/_index', 'getting-started/venndiagram', 'getting-started/karnaughmap'],
    },
    {
      type: 'category',
      label: 'Components',
      items: [
        'components/_index',
        'components/upsetjs',
        'components/venndiagram',
        'components/karnaughmap',
        'components/modes',
        'components/themes',
      ],
    },
    {
      type: 'category',
      label: 'Addons',
      items: ['addons/_index', 'addons/boxplot', 'addons/categorical'],
    },
    {
      type: 'category',
      label: 'Plots',
      items: ['plots/_index', 'plots/barchart', 'plots/histogram', 'plots/piechart', 'plots/scatterplot'],
    },
    {
      type: 'category',
      label: 'Examples',
      items: ['examples/_index'],
    },
    {
      type: 'category',
      label: 'API',
      items: [
        {
          type: 'link',
          label: 'Model',
          href: '/api/model',
        },
        {
          type: 'link',
          label: 'Addons',
          href: '/api/addons',
        },
        {
          type: 'link',
          label: 'Bundle',
          href: '/api/bundle',
        },
        {
          type: 'link',
          label: 'Jupyter',
          href: '/api/jupyter',
        },
        {
          type: 'link',
          label: 'Math',
          href: '/api/math',
        },
        {
          type: 'link',
          label: 'Plots',
          href: '/api/plots',
        },
        {
          type: 'link',
          label: 'React',
          href: '/api/react',
        },
      ],
    },
    'faq',
  ],
};
