var path = require('path');
var webpack = require('webpack');

// Webpack Plugins
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ngToolsWebpack = require('@ngtools/webpack');

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.MODE;
var isProd = ENV === 'build';
var nodeModules = path.join(process.cwd(), 'node_modules');

module.exports = function makeWebpackConfig() {
  /**
   * Config
   * Reference: https://webpack.js.org/configuration/
   * This is the object where all configuration gets set
   */
  var config = {};

  /**
   * Devtool
   * Reference: https://webpack.js.org/configuration/devtool/
   * Type of sourcemap to use per build type
   */
  if (isProd) {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'eval-source-map';
  }

  /**
   * Entry
   * Reference: https://webpack.js.org/concepts/entry-points/
   */
  config.entry = {
    polyfills: './demo/src/polyfills.ts',
    vendorStyles: [
      './node_modules/prismjs/themes/prism.css',
      './node_modules/bootstrap/dist/css/bootstrap.css'
    ],
    main: './demo/src/main.ts'
  };

  /**
   * Output
   * Reference: https://webpack.js.org/concepts/output/
   */
  config.output = {
    path: root('demo', 'dist'),
    publicPath: '/',
    filename: isProd ? 'js/[name].[hash].js' : 'js/[name].js',
    chunkFilename: isProd ? '[id].[hash].chunk.js' : '[id].chunk.js'
  };

  /**
   * Resolve
   * Reference: https://webpack.js.org/configuration/resolve/
   */
  config.resolve = {
    modules: [root('demo'), 'node_modules'],
    // only discover files that have those extensions
    extensions: ['.ts', '.js', '.css', '.scss', '.html'],

    alias: {
      '@ng-bootstrap/ng-bootstrap': root('src/index.ts')
    }
  };

  /**
   * Loaders
   * Reference: https://webpack.js.org/concepts/loaders/
   * List: https://webpack.js.org/loaders/
   * This handles most of the magic responsible for converting modules
   */
  config.module = {
    rules: [
      // Support for .ts files.
      {
        test: /\.ts$/,
        use: isProd ? '@ngtools/webpack' : 'ts-loader'
      },

      {
        test: /\.ts$/,
        use: 'angular2-template-loader'
      },

      // copy those assets to output
      {test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/, use: 'file-loader?name=fonts/[name].[hash].[ext]?'},

      // Support for CSS as raw text
      // use 'null' loader in test mode (https://webpack.js.org/loaders/null-loader/)
      // all css in src/style will be bundled in an external css file
      {
        test: /\.css$/,
        exclude: root('demo', 'src', 'app'),
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: 'style-loader',
            options: {
              insertAt: 'top'
            }
          },
          use: 'css-loader?sourceMap-loader!postcss-loader'
        })
      },
      // all css required in src/app files will be merged in js files
      {test: /\.css$/, include: root('demo', 'src', 'app'), use: 'raw-loader!postcss-loader'},

      // support for .scss files
      // use 'null' loader in test mode (https://webpack.js.org/loaders/null-loader/)
      // all css in src/style will be bundled in an external css file
      {
        test: /\.scss$/,
        exclude: root('src', 'app'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?sourceMap-loader!postcss-loader!sass-loader'
        })
      },
      // all css required in src/app files will be merged in js files
      {test: /\.scss$/, exclude: root('demo', 'src', 'style'), use: 'raw-loader!postcss-loader!sass-loader'},

      // support for .html as raw text
      // todo: change the loader to something that adds a hash to images
      {test: /\.html$/, use: 'raw-loader'},

      {test: /\.md$/, use: 'html-loader!markdown-loader'}
    ],
    noParse: [/.+zone\.js\/dist\/.+/]
  };

  /**
   * Plugins
   * Reference: https://webpack.js.org/configuration/plugins/
   * List: https://webpack.js.org/plugins/
   */
  config.plugins = [
    // Define env variables to help with builds
    // Reference: https://webpack.js.org/plugins/define-plugin/
    new webpack.DefinePlugin({
      // Environment helpers
      'process.env': {
        ENV: JSON.stringify(ENV),
        version: JSON.stringify(require('./package.json').version)
      }
    }),

    new CommonsChunkPlugin({
      name: 'vendor',
      minChunks: (module) => module.resource && module.resource.startsWith(nodeModules),
      chunks: [
        'main'
      ]
    }),

    new CommonsChunkPlugin({
      names: ['vendor', 'polyfills', 'inline']
    }),

    // Inject script and link tags into html files
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      template: './demo/src/public/index.html',
      chunksSortMode: 'dependency'
    }),

    // Extract css files
    // Reference: https://webpack.js.org/plugins/extract-text-webpack-plugin/
    // Disabled when in test mode or not in build mode
    new ExtractTextPlugin({filename: 'css/[name].[hash].css', disable: !isProd}),

    new webpack.LoaderOptionsPlugin({
      // add debug messages
      debug: !isProd,
      minimize: isProd,
      /**
       * PostCSS
       * Reference: https://github.com/postcss/autoprefixer-core
       * Add vendor prefixes to your css
       */
      postcss: [
        autoprefixer({
          browsers: ['last 2 version']
        })
      ]
    }),

    // Workaround to remove Webpack warning in system_js_ng_module_factory_loader.js
    // See https://github.com/angular/angular/issues/11580
    new webpack.ContextReplacementPlugin(
      /\@angular(\\|\/)core(\\|\/)esm5/,
      root('demo', 'src', 'app')
    )
  ];

  // Add build specific plugins
  if (isProd) {
    config.plugins.push(
      // Reference: https://github.com/angular/angular-cli/tree/master/packages/webpack
      new ngToolsWebpack.AngularCompilerPlugin({
        tsConfigPath: './tsconfig-aot.json',
        entryModule: root('demo/src/app/') + 'app.module#NgbdModule'
      }),

      // Reference: https://webpack.js.org/plugins/no-emit-on-errors-plugin/
      // Only emit files when there are no errors
      new webpack.NoEmitOnErrorsPlugin(),

      // Reference: https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        output: {comments: false},
        sourceMap: true
      }),

      // Copy assets from the public folder
      // Reference: https://github.com/kevlened/copy-webpack-plugin
      new CopyWebpackPlugin([{
        from: root('demo/src/public')
      }])
    );
  }

  /**
   * Dev server configuration
   * Reference: https://webpack.js.org/configuration/dev-server/
   */
  config.devServer = {
    contentBase: 'demo/src/public',
    historyApiFallback: true,
    stats: 'minimal' // none (or false), errors-only, minimal, normal (or true) and verbose
  };

  return config;
}();

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
