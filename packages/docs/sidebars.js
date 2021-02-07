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
      items: [
        'examples/_index',
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
