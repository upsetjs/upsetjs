const exec = require('child_process').execSync;

function resolveGitBranch() {
  return exec('git rev-parse --abbrev-ref HEAD').toString();
}
module.exports = {
  title: 'UpSet.js',
  tagline:
    'UpSet.js is a re-implementation of UpSetR to create interactive set visualizations for more than three sets',
  url: 'https://upset.js.org',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'upsetjs', // Usually your GitHub org/user name.
  projectName: 'upsetjs', // Usually your repo name.
  customFields: {
    branch: resolveGitBranch(),
  },
  themeConfig: {
    hideableSidebar: true,
    image: 'img/preview.png',
    metadatas: [{ name: 'twitter:card', content: 'summary' }],
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    announcementBar: {
      id: 'star_me', // Any value that will identify this message.
      content:
        '⭐️ If you like and use <a target="_blank" rel="noopener noreferrer" href="https://github.com/upsetjs/upsetjs">@upsetjs</a>, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/upsetjs/upsetjs">GitHub</a>! ⭐️!',
    },
    navbar: {
      title: 'UpSet.js',
      hideOnScroll: true,
      logo: {
        alt: 'UpSet.js',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'app/',
          activeBasePath: 'app/',
          label: 'Demo App',
          position: 'left',
        },
        {
          to: 'docs',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'api',
          activeBasePath: 'api',
          label: 'API',
          position: 'left',
        },
        // {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/upsetjs/upsetjs',
          label: 'GitHub',
          position: 'right',
        },
        {
          label: '@sgratzl',
          href: 'https://github.com/sgratzl',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Resources',
          items: [
            {
              label: 'Docs',
              to: 'docs',
            },
            {
              label: 'Getting Started',
              to: 'docs/getting-started',
            },
            {
              label: 'Examples',
              to: 'docs/examples',
            },
            {
              label: 'API Reference',
              to: 'api',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/upsetjs/upsetjs',
            },
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/upsetjs/upsetjs/dicussions',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: '@sgratzl',
              href: 'https://github.com/sgratzl',
            },
            {
              label: 'LineUp-lite',
              href: 'https://lineup-lite.js.org',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} <a href="https://www.sgratzl.com">Samuel Gratzl</a>. All rights reserved. Built with Docusaurus.`,
    },
    // algolia: {
    //   apiKey: '85bfa6629a04cc69c9d91c95db0df80f',
    //   indexName: 'lineup-lite',

    //   // Optional: see doc section bellow
    //   contextualSearch: false,

    //   // Optional: Algolia search parameters
    //   searchParameters: {},

    //   //... other Algolia params
    // },
  },
  themes: ['@docusaurus/theme-live-codeblock'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/upsetjs/upsetjs/edit/main/packages/docs',
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/edit/main/packages/docs',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
