const path = require('path');

module.exports = {
  entry: {
    'emrald-sankey-timeline': path.resolve(
      __dirname,
      'Emrald-UI',
      'src',
      'components',
      'diagrams',
      'SankeyTimelineDiagram',
      'standalone.tsx',
    ),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'EMRALD_Sim', 'sankey'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    fallback: {},
  },
};
