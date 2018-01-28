
/* global window document hljs */

// library used by RevealJS to download dependency plugins (here: markdown and highlighting)
require('headjs/dist/1.0.0/head.min.js')

// required by the RevealJS markdown plugins
const Reveal = require('reveal.js')

window.Reveal = Reveal

// CSS styles
require('reveal.js/css/reveal.css')
require('../reveal/theme-zenika/theme.css')
require('../reveal/font-awesome/css/font-awesome.min.css')
// require('reveal.js/lib/css/zenburn.css') // CSS stylesheet used for code highlighting
// require('./slides.css') // customize your CSS here

// includes the plugins in the build, at the url expected by RevealJS
require('file-loader?name=plugin/markdown/[name].[ext]!reveal.js/plugin/markdown/marked.js')
require('file-loader?name=plugin/markdown/[name].[ext]!reveal.js/plugin/markdown/markdown.js')
require('file-loader?name=plugin/highlight/[name].[ext]!reveal.js/plugin/highlight/highlight.js')

const revealDefaultOptions = {
  // see https://github.com/hakimel/reveal.js#configuration
  slideNumber: true,
  // so that live-reload keeps you on the same slide
  history: true,
  dependencies: [
    // interpret Markdown in <section> elements
    { src: 'plugin/markdown/marked.js', condition() { return !!document.querySelector('[data-markdown]') } },
    { src: 'plugin/markdown/markdown.js', condition() { return !!document.querySelector('[data-markdown]') } },

    // syntax highlight for <code> elements
    { src: 'plugin/highlight/highlight.js', async: true, callback() { hljs.initHighlightingOnLoad() } }
  ]
}

module.exports = {
  getInitializer(content) {
    return function initialize(options = {}) {
      const revealOptions = Object.assign(
        {},
        revealDefaultOptions,
        options
      )
      // loads the markdown content and starts the slideshow
      window.document.getElementById('source').innerHTML = content

      Reveal.initialize(revealOptions)
    }
  }
}
