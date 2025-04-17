import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "EMRALD Documentation",
  description: "The official documentation for the EMRALD application",
  head: [['link', { rel: 'icon', href: '/images/EMRALD-logo.png' }],  ['link', { rel: 'stylesheet', href: '/custom.css' }] ],
  vite: {
    resolve: {
      preserveSymlinks: true
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/Modeling/Introduction' },
      { text: 'Validation Cases', link: 'validation-cases' },
      { text: 'FAQ', link: 'faqs' },
      {text: 'Video Tutorials', link: 'https://www.youtube.com/playlist?list=PLX2nBoWRisnXWhC2LD9j4jV0iFzQbRcFX'},
      { text: 'EMRALD', link: 'https://emrald3app.inl.gov/' }
    ],

    sidebar: [
      {
        text: 'Documentation',
        items: [
          { text: 'Introduction', link: '/Modeling/Introduction' },
          { text: 'Web User Interface', link: '/Modeling/webUIOverview' },
          { text: 'Demo Project', link: '/Modeling/demoProject' },
          { text: 'Diagrams', link: '/Modeling/diagrams' },
          { text: 'States', link: '/Modeling/states' },
          { text: 'Events', link: '/Modeling/events' },
          { text: 'Actions', link: '/Modeling/actions' },
          { text: 'Variables', link: '/Modeling/variables' },
          { text: 'Logic Tree', link: '/Modeling/logicTree' },
          { text: 'Templates', link: '/Modeling/templates' },
          { text: 'External Simulators', link: '/Modeling/externalSims' },
          { text: 'Icons', link: '/Modeling/icons' },
          { text: 'Solver', link: '/Modeling/solver' },
          { text: 'XMPP Protocol', link: '/Modeling/xmppProtocol' },
          { text: 'Backend Info', link: '/Modeling/backendInfo' },
          { text: 'Command Line Options', link: '/Modeling/cmdLineOptions' }
        ]
      },
      {
        text: 'Schema',
        items: [
          { text: 'Introduction', link: '/Modeling/schema-intro' },
          { text: 'EMRALD model schema', 
            link: '/Modeling/schema-md/emrald_jsonschemav3_0'
          }
        ]
      },
      {
        text: 'Validation Cases',
        items: [
          { text: 'Validation Cases', link: 'validation-cases' },
          { text: 'Templates', link: 'templates' }          
        ]
      }
    ]
  }
})
