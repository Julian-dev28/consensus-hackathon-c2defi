import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use environment variable to set mode. Default to 'production' if not set.
const mode = process.env.NODE_ENV || 'production';

export default {
  mode: mode,
  entry: './src/sdk.ts', // your main TypeScript file
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  experiments: {
    outputModule: true
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    libraryTarget: 'module',
    module: true,
    filename: 'sdk.js', // output bundle file name
    path: path.resolve(__dirname, 'dist'), // output path
  },
};
