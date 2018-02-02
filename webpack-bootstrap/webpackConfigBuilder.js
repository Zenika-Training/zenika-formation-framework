const { Maybe } = require('monet')
const webpackCommonConfig = require('./webpack.config.js')
const path = require('path')
const webpack = require('webpack')
const git = require('git-rev-sync')

const safeSuffix = nullableText => Maybe.fromNull(nullableText).map(text => `-${text}`).orSome('')

module.exports = {
  buildConfig({ formationPackage, headTitleSuffix, formationRootPath, slidesEntry, httpPort }) {
    const webpackConfig = Object.assign({}, webpackCommonConfig)
    webpackConfig.entry.app = Maybe.fromNull(slidesEntry).orSome('./webpackSlides.js')
    webpackConfig.output.path = Maybe.fromNull(formationRootPath)
        .map(formationPath => path.join(formationPath, 'dist-webpack'))
        .some()

    webpackConfig.devServer.port = Maybe.fromNull(httpPort).orSome(webpackConfig.devServer.port)

    const headTitle = `Zenika-Formation${safeSuffix(formationPackage.name)}${safeSuffix(headTitleSuffix)}`
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        // text displayed in the head.title html element
        HEAD_TITLE: JSON.stringify(headTitle)
      })
    )
    const cssRule = webpackConfig.module.rules.find(rule => String(rule.test) === '/\\.css$/')
    if (cssRule) {
      cssRule.use.push({
        loader: 'zenika-formation-framework/node_modules/string-replace-loader',
        query: {
          search: 'VERSION',
          replace: `${new Date().toISOString().slice(0, 10)}#${git.short(formationRootPath)}`
        }
      })
    } else {
      throw new Error('failed to find CSS rule in the webpack configuration; cannot replace VERSION')
    }

    return webpackConfig
  }
}
