module.exports = {
  someSidebar: [
    {
      type: 'category',
      label: 'UpSet.js',
      items: ['_index', 'design-principles', 'data'],
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
      label: 'Integrations',
      collapsed: false,
      items: [
        'integrations/_index',
        {
          type: 'category',
          label: 'Web Frameworks',
          items: ['integrations/react', 'integrations/vanilla', 'integrations/vue'],
        },
        {
          type: 'category',
          label: 'Data Science',
          items: [
            'integrations/observablehq',
            'integrations/r',
            'integrations/jupyter',
            'integrations/powerbi',
            'integrations/tableau',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      items: ['examples/_index', 'examples/vue'],
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
          label: 'React',
          href: '/api/react',
        },
        {
          type: 'link',
          label: 'Bundle',
          href: '/api/bundle',
        },
        {
          type: 'link',
          label: 'Math',
          href: '/api/math',
        },
        {
          type: 'link',
          label: 'Addons',
          href: '/api/addons',
        },
        {
          type: 'link',
          label: 'Plots',
          href: '/api/plots',
        },
        {
          type: 'link',
          label: 'Jupyter',
          href: '/api/jupyter',
        },
      ],
    },
    'faq',
  ],
};
