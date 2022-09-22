/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const frontend = require('nmde-common/config/frontend');
const path = require('path');

module.exports = frontend(
  path.resolve(__dirname, 'src', 'emrald.ts'),
  path.resolve(__dirname, 'dist'),
  {
    mode: 'production',
    output: {
      library: 'sankeyTimeline',
    },
    resolve: {
      fallback: {},
    },
  },
  'emrald-sankey-timeline',
);
