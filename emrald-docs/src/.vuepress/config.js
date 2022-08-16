// Copyright 2021 Battelle Energy Alliance

const { description } = require('../../package');

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'EMRALD Docs',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    sidebarDepth: 2,
    nav: [
      {
        text: 'Guide',
        link: '/guide/',
      },
      {
        text: 'FAQ',
        link: '/faq/'
      },
      {
        text: 'EMRALD',
        link: 'https://emraldapp.inl.gov/'
      }
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Guide',
          collapsable: false,
          children: [
            '',
            'Modeling/webUIOverview',
            'Modeling/demoProject',
            'Modeling/diagrams',
            'Modeling/states',
            'Modeling/events',
            'Modeling/actions',
            'Modeling/variables',
            'Modeling/logicTree',
            'Modeling/externalSims',
            'Modeling/icons', 
            'Modeling/solver',
            'Modeling/xmppProtocol',
            'Modeling/backendInfo',   
            'Modeling/cmdLineOptions',        
          ]
        }
      ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}