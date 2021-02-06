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
            {
              type: 'category',
              label: 'R/RMarkdown/RShiny',
              items: [
                'integrations/r',
                {
                  type: 'link',
                  label: 'Package Docs',
                  href: '/integrations/r/',
                },
                {
                  type: 'link',
                  label: 'Introduction Rmd',
                  href: '/integrations/r/articles/basic',
                },
                {
                  type: 'link',
                  label: 'Combination Modes Rmd',
                  href: '/integrations/r/articles/combinationModes',
                },
                {
                  type: 'link',
                  label: 'Colors Rmd',
                  href: '/integrations/r/articles/colors',
                },
                {
                  type: 'link',
                  label: 'VennDiagram Rmd',
                  href: '/integrations/r/articles/venn',
                },
                {
                  type: 'link',
                  label: 'KarnaughMap Rmd',
                  href: '/integrations/r/articles/kmap',
                },
              ],
            },
            {
              type: 'category',
              label: 'Python Jupyter',
              items: [
                'integrations/jupyter',
                {
                  type: 'link',
                  label: 'Introduction NB',
                  href: '/integrations/jupyter/',
                },
                {
                  type: 'link',
                  label: 'Colors NB',
                  href: '/integrations/jupyter/colors',
                },
                {
                  type: 'link',
                  label: 'Venn Diagram NB',
                  href: '/integrations/jupyter/venn',
                },
                {
                  type: 'link',
                  label: 'Karnaugh Map NB',
                  href: '/integrations/jupyter/kmap',
                },
              ],
            },
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
          label: 'R/RMarkdown/RShiny',
          href: '/integrations/r',
        },
        {
          type: 'link',
          label: 'Python Jupyter',
          href: '/api/jupyter',
        },
      ],
    },
    'faq',
  ],
};
