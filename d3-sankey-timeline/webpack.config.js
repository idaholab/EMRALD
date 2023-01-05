/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    '../EMRALD_Sim/sankey/emrald-sankey-timeline': path.resolve(__dirname, 'src', 'emrald.ts'),
    '../Emrald_Site/sankey/emrald-sankey-timeline': path.resolve(__dirname, 'src', 'emrald.ts'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  output: {
    filename: '[name].js',
    library: 'sankeyTimeline',
    path: path.resolve(__dirname),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './emrald-sankey-timeline.html',
          to: '../Emrald_Site/sankey/emrald-sankey-timeline.html',
        },
        {
          from: './emrald-sankey-timeline.html',
          to: '../EMRALD_Sim/sankey/emrald-sankey-timeline.html',
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    fallback: {},
  },
};
