(function (window, document, Promise, Reveal) {

  var config = {
    revealTheme: '/reveal/theme-zenika/'
  };

  isFileExist('reveal.js/css/reveal.min.css')
    .then(function () {
      // NPM 3
      config.revealModule = 'reveal.js/';
    })
    .catch(function () {
      // NPM 2
      config.revealModule = 'node_modules/reveal.js/';
    });

  Promise.all([
    applyPrintStylesheets(),
    insertSlides()
  ]).then(runReveal);

  function runReveal() {
    // Full list of configuration options available here:
    // https://github.com/hakimel/reveal.js#configuration
    Reveal.initialize({
      controls: true,
      progress: true,
      history: true,
      center: false,
      transition: 'fade', // default/cube/page/concave/zoom/linear/fade/none
      backgroundTransition: 'fade',
      rollingLinks: true,
      slideNumber: false,
      mouseWheel: true,
      margin: 0,
      maxScale: 2.0,
      width: 1124,
      height: 795,

      // Optional libraries used to extend on reveal.js
      dependencies: [
        { src: config.revealModule + 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
        { src: config.revealModule + 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: config.revealModule + 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: config.revealModule + 'plugin/highlight/highlight.js', async: true, callback: function() {
            // Define Plain Text language for Console output
            hljs.LANGUAGES.text = {
              keywords: '',
              contains: [
                hljs.QUOTE_STRING_MODE
              ]
            };

            var allCodeTags = document.querySelectorAll( 'pre code' );
            Array.prototype.forEach.call(allCodeTags, function(codeTag) {
               hljs.highlightBlock(codeTag);
            });
          }
        },
        { src: config.revealModule + 'plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
        { src: config.revealModule + 'plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } },
        { src: 'reveal/plugins/zenika-footer/zenika-footer.js', condition: function() { return !!document.body.classList; } }
      ]
    });
  }


  function appendStylesheetWhenUrlMatches(head, regexp, stylesheets) {
    if (window.location.search.match(regexp)) {
      stylesheets.forEach(function (stylesheet) {
        var linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.type = 'text/css';
        linkElement.href = stylesheet;
        head.appendChild(linkElement);
      });
    }
  }

  function applyPrintStylesheets() {
    return new Promise(function (resolve) {
      var head = document.getElementsByTagName('head')[0];
      appendStylesheetWhenUrlMatches(head, /print-pdf/gi, [config.revealModule + 'css/print/pdf.css', config.revealTheme + 'pdf.css']);
      appendStylesheetWhenUrlMatches(head, /edition/gi, [config.revealTheme + 'edition.css']);
      resolve();
    });
  }

  function insertSlides() {
    return new Promise(function (resolve, reject) {

      var request = new XMLHttpRequest();
      request.responseType = 'json';

      request.onload = function () {
        var slideContainer = document.querySelector('.slides');

        request.response.forEach(function (path) {
          var chapter = document.createElement('section');
          chapter.dataset.markdown = path;
          chapter.dataset.vertical = '^\r?\n\r?\n\r?\n';
          chapter.dataset.notes = '^Notes :';
          slideContainer.appendChild(chapter);
        });
        resolve(request.response);
      };

      request.onerror = function (event) {
        console.error(event);
        reject('Erreur chargement des slides.');
      };

      request.open('GET', 'slides.json');
      request.send();
    });
  }

  function isFileExist(url) {
    return new Promise(function (resolve, reject) {
      var request = new XMLHttpRequest();
      request.onload = function () {
        console.log('onload', request.status);
        if (request.status === 200) {
          resolve(request.response);
        } else {
          reject('File inacessible');
        }
      };
      request.onerror = function (event) {
        console.log(event);
      };
      request.open('GET', url);
      request.send();
    });
  }


})(window, document, Promise, Reveal);
