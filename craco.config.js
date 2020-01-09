const { whenDev, when, whenProd, ESLINT_MODES } = require('@craco/craco');
const WebpackBar = require('webpackbar');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const postcssPx2rem = require('postcss-px2rem');
const TerserPlugin = require('terser-webpack-plugin');
const CracoLessPlugin = require('craco-less');
const interpolateHtml = require('craco-interpolate-html-plugin');
const webpack = require('webpack');
const argv = require('yargs').argv;
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

// const UglifyJS = require('uglify-es');
const fs = require('fs');
const lessToJs = require('less-vars-to-js');

const path = path => require('path').resolve(__dirname, path);
const APP = argv.app;

const config = require(path(`./src/app/${APP}/_config/app.js`));

const envConfig = {};
const _alias = {};

Object.keys(config.alias || {}).forEach(key => (_alias[key] = path(config.alias[key])));

Object.keys(config).forEach(key => (envConfig[`process.env.${key}`] = JSON.stringify(config[key])));

let loading = '';
if (config.loading) {
  loading = fs.readFileSync(`./public/loading/${config.loading}`);
}
const themeLess = lessToJs(fs.readFileSync(path(`./src/app/${APP}/_config/theme.less`), 'utf8'));

module.exports = {
  eslint: {
    mode: ESLINT_MODES.file,
    loaderOptions: eslintOptions => {
      return { ...eslintOptions, ignore: true };
    }
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          modifyVars: themeLess,
          javascriptEnabled: true
        },
        cssLoaderOptions: {
          modules: true,
          localIdentName: '[local]_[hash:base64:5]'
        },
        modifyLessRule: lessRule => {
          lessRule.exclude = /node_modules/;
          return lessRule;
        }
      }
    },
    {
      plugin: interpolateHtml,
      options: {
        loading: loading,
        title: config.title
      }
    },
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          modifyVars: themeLess,
          javascriptEnabled: true
        },
        modifyLessRule: lessRule => {
          lessRule.include = path('./node_modules');
          return lessRule;
        }
      }
    },
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          webpackConfig.module.rules.push({
            test: /\.(js|tsx|jsx|ts)$/,
            loader: path('./jsxtorem.js'),
            options: {
              remUnit: 37.5,
              remFixed: 8
            }
          });
          webpackConfig.module.rules.push({
            test: /\.(js|tsx|jsx|ts)$/,
            use: 'react-hot-loader/webpack',
            include: /node_modules/
          });
          return webpackConfig;
        }
      }
    }
  ],
  babel: {
    plugins: [['import', { libraryName: 'antd-mobile', style: true }]]
  },
  style: {
    postcss: {
      mode: 'extends',
      plugins: config.rem ? [postcssPx2rem({ remUnit: 37.5 })] : []
    }
  },
  webpack: {
    alias: {
      '@': path('./src'),
      '@app': path(`./src/app/${APP}`),
      ..._alias
    },
    configure: {
      optimization: {
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true
              }
            }
          })
        ]
      }
    },

    plugins: [
      ...when(argv.analyze, () => [new BundleAnalyzerPlugin({ defaultSizes: 'gzip' })], []),
      ...whenDev(
        () => [
          new WebpackBar(),
          new WebpackNotifierPlugin({
            excludeWarnings: true,
            title: `包网项目[${APP}]`,
            contentImage: path('./logo.png')
          })
        ],
        []
      ),
      ...whenProd(() => {
        let arr = [
          new WebpackBuildNotifierPlugin({ title: `包网项目[${APP}]打包完毕` }),
          new webpack.DllReferencePlugin({
            manifest: require(path('./public/dll/bundle.manifest.json'))
          })
        ];
        if (config.isPrerenderSPA) {
          arr.push(
            // 预渲染插件
            new PrerenderSPAPlugin({
              routes: ['/'], // 需要的路由
              staticDir: path('build'), // 开始的路径
              captureAfterTime: 10000, // 等待时间
              renderer: new PrerenderSPAPlugin.PuppeteerRenderer({
                // 渲染窗口
                defaultViewport: {
                  width: 375,
                  height: 667
                }
                // headless: false //打开调试
              })
            })
          );
        }
        return arr;
      }, []),
      new webpack.DefinePlugin({
        APP: JSON.stringify(APP),
        ...envConfig
      })
    ]
  },
  devServer: devServerConfig => {
    devServerConfig.proxy = config.proxy || [];
    return devServerConfig;
  }
};
