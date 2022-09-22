/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const CopyPlugin = require('copy-webpack-plugin');
const frontend = require('nmde-common/config/frontend');
const path = require('path');

module.exports = frontend(
  path.resolve(__dirname, 'src', 'emrald.ts'),
  path.resolve(__dirname, '..', 'EMRALD_Sim', 'sankey'),
  {
    mode: 'production',
    output: {
      library: 'sankeyTimeline',
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: './emrald-sankey-timeline.html',
            to: 'emrald-sankey-timeline.html',
          },
        ],
      }),
    ],
    resolve: {
      fallback: {},
    },
  },
  'emrald-sankey-timeline',
);
