module.exports = {
  someSidebar: [
    {
      type: 'category',
      label: 'UpSet.js',
      link: { type: 'doc', id: 'index' },
      items: ['design-principles', 'data'],
    },
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      link: { type: 'doc', id: 'getting-started/index' },
      items: ['getting-started/venndiagram', 'getting-started/karnaughmap'],
    },
    {
      type: 'category',
      label: 'Components',
      link: { type: 'doc', id: 'components/index' },
      items: [
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
      link: { type: 'doc', id: 'addons/index' },
      items: ['addons/boxplot', 'addons/categorical'],
    },
    {
      type: 'category',
      label: 'Plots',
      link: { type: 'doc', id: 'plots/index' },
      items: ['plots/barchart', 'plots/histogram', 'plots/piechart', 'plots/scatterplot'],
    },
    {
      type: 'category',
      label: 'Integrations',
      collapsed: false,
      link: { type: 'doc', id: 'integrations/index' },
      items: [
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
                  href: 'https://upset.js.org/integrations/r/',
                },
                {
                  type: 'link',
                  label: 'Introduction Rmd',
                  href: 'https://upset.js.org/integrations/r/articles/basic',
                },
                {
                  type: 'link',
                  label: 'Combination Modes Rmd',
                  href: 'https://upset.js.org/integrations/r/articles/combinationModes',
                },
                {
                  type: 'link',
                  label: 'Colors Rmd',
                  href: 'https://upset.js.org/integrations/r/articles/colors',
                },
                {
                  type: 'link',
                  label: 'VennDiagram Rmd',
                  href: 'https://upset.js.org/integrations/r/articles/venn',
                },
                {
                  type: 'link',
                  label: 'KarnaughMap Rmd',
                  href: 'https://upset.js.org/integrations/r/articles/kmap',
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
                  href: 'https://upset.js.org/integrations/jupyter/',
                },
                {
                  type: 'link',
                  label: 'Colors NB',
                  href: 'https://upset.js.org/integrations/jupyter/colors',
                },
                {
                  type: 'link',
                  label: 'Venn Diagram NB',
                  href: 'https://upset.js.org/integrations/jupyter/venn',
                },
                {
                  type: 'link',
                  label: 'Karnaugh Map NB',
                  href: 'https://upset.js.org/integrations/jupyter/kmap',
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
      link: { type: 'doc', id: 'examples/index' },
      items: [
        'examples/colored',
        'examples/queries',
        'examples/title',
        'examples/staticData',
        'examples/skeletons',
        'examples/big',
        'examples/venn',
        'examples/vennColored',
        'examples/vennQueries',
        'examples/euler',
        'examples/kmap',
        'examples/kmapQueries',
        'examples/vue',
      ],
    },
    {
      type: 'category',
      label: 'API',
      items: [
        {
          type: 'link',
          label: 'Model',
          href: 'https://upset.js.org/api/model/modules.html',
        },
        {
          type: 'link',
          label: 'React',
          href: 'https://upset.js.org/api/react/modules.html',
        },
        {
          type: 'link',
          label: 'Bundle',
          href: 'https://upset.js.org/api/bundle/modules.html',
        },
        {
          type: 'link',
          label: 'Math',
          href: 'https://upset.js.org/api/math/modules.html',
        },
        {
          type: 'link',
          label: 'Addons',
          href: 'https://upset.js.org/api/addons/modules.html',
        },
        {
          type: 'link',
          label: 'Plots',
          href: 'https://upset.js.org/api/plots/modules.html',
        },
        {
          type: 'link',
          label: 'R/RMarkdown/RShiny',
          href: 'https://upset.js.org/integrations/r',
        },
        {
          type: 'link',
          label: 'Python Jupyter',
          href: 'https://upset.js.org/api/jupyter',
        },
      ],
    },
    'faq',
  ],
};
