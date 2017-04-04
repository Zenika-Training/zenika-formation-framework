(function (window, document, Promise, Reveal) {

  var config = {
    revealTheme: '/reveal/theme-zenika/'
  };

  fileExists('reveal.js/css/reveal.min.css')
    .then(function () {
      // NPM 3
      config.revealModule = 'reveal.js/';
      config.prismModule = 'prismjs/';
      console.log('NPM 3 detected.');
    })
    .catch(function () {
      // NPM 2
      config.revealModule = 'node_modules/reveal.js/';
      config.prismModule = 'node_modules/prismjs/';
      console.log('NPM 2 detected.');
    })
    .then(function(){
      Promise.all([
        applyPrintStylesheets(),
        insertSlides()
      ]).then(runReveal);
    });

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
      keyboard: {
        37: function leftArrow() {
          if (isRemoteMode()) Reveal.prev();
          else Reveal.left();
        },
        38: function upArrow() {
          if (isRemoteMode()) Reveal.prev();
          else Reveal.up();
        },
        39: function rightArrow() {
          if (isRemoteMode()) Reveal.next();
          else Reveal.right();
        },
        40: function downArrow() {
          if (isRemoteMode()) Reveal.next();
          else Reveal.down();
        },
        82: function rKey() {
          toggleRemoteMode();
        },
        87: function wKey() {
          cycleWideModes();
        }
      },
      margin: 0,
      maxScale: 2.0,
      width: selectWidth(window.location.search),
      height: 795,

      // Optional libraries used to extend on reveal.js
      dependencies: [
        { src: config.revealModule + 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
        { src: config.prismModule + 'prism.js', condition: function() { return true; }, callback: function() {
          window.hljs = {
            highlightAuto : function(code, lang) {
              var langDef = Prism.languages[lang] ? Prism.languages[lang] : Prism.languages.clike;
              return { value: Prism.highlight(code, Prism.languages[lang]) };
            }
          };
        } },
        { src: config.prismModule + 'components/prism-bash.js', condition: function() { return true; }, callback: function() {
          Prism.languages.shell = Prism.languages.bash;
        }},
        { src: config.prismModule + 'components/prism-clike.js', condition: function() { return true; }},
        { src: config.prismModule + 'components/prism-go.js', condition: function() { return true; }},
        { src: config.prismModule + 'components/prism-java.js', condition: function() { return true; }},
        { src: config.prismModule + 'components/prism-json.js', condition: function() { return true; }},
        { src: config.prismModule + 'components/prism-typescript.js', condition: function() { return true; }},
        { src: config.prismModule + 'components/prism-scala.js', condition: function() { return true; }},
        { src: config.revealModule + 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: config.revealModule + 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: config.revealModule + 'plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
        { src: config.revealModule + 'plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } },
        { src: 'reveal/plugins/zenika-footer/zenika-footer.js', condition: function() { return !!document.body.classList; } }
      ]
    });
  }

  function selectWidth(queryParams) {
    if (queryParameterIsPresent(window.location.search, '16x9')) return 1413; // 16:9
    else if (queryParameterIsPresent(window.location.search, '16x10')) return 1272; // 16:10
    else return 1124; // ~4:3
  }

  function cycleWideModes() {
    var queryString = window.location.search;
    if (queryParameterIsPresent(queryString, '16x9')) {
      queryString = removeQueryParameter(queryString, '16x9');
      queryString = addQueryParameter(queryString, '16x10');
    } else if (queryParameterIsPresent(queryString, '16x10')) {
      queryString = removeQueryParameter(queryString, '16x10');
    } else {
      queryString = addQueryParameter(queryString, '16x9');
    }
    window.location.search = queryString;
  }

  function isRemoteMode() {
    return Reveal.isOverview()
      ? false
      : hasRemoteQueryParameter();
  }

  function toggleRemoteMode() {
    if (hasRemoteQueryParameter()) disableRemoteMode();
    else enableRemoteMode();
  }

  function hasRemoteQueryParameter() {
    return queryParameterIsPresent(window.location.search, 'remote')
  }

  function enableRemoteMode() {
    window.location.search = addQueryParameter(window.location.search, 'remote')
  }

  function disableRemoteMode() {
    window.location.search = removeQueryParameter(window.location.search, 'remote')
  }

  function queryParameterIsPresent(queryString, queryParameter) {
    return queryParameterRegexp(queryParameter).test(queryString);
  }

  function addQueryParameter(queryString, queryParameter) {
    return queryString + (queryString.match(/\?/)
      ? '&' + queryParameter
      : '?' + queryParameter);
  }

  function removeQueryParameter(queryString, queryParameter) {
    return queryString.replace(
      queryParameterRegexp(queryParameter),
      function (match, before, after) {
        return after ? before : '';
      });
  }

  function queryParameterRegexp(queryParameter) {
    return new RegExp('([?&])' + queryParameter + '(&|$)');
  }

  function appendStylesheet(head, stylesheets) {
    stylesheets.forEach(function (stylesheet) {
      var linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.type = 'text/css';
      linkElement.href = stylesheet;
      head.appendChild(linkElement);
    });
  }

  function appendStylesheetWhenUrlMatches(head, regexp, stylesheets) {
    if (window.location.search.match(regexp)) {
      appendStylesheet(head, stylesheets);
    }
  }

  function applyPrintStylesheets() {
    return new Promise(function (resolve) {
      var head = document.getElementsByTagName('head')[0];
      appendStylesheet(head, [config.prismModule + 'themes/prism.css']);
      appendStylesheetWhenUrlMatches(head, /print-pdf/gi, [config.revealModule + 'css/print/pdf.css', config.revealTheme + 'pdf.css']);
      appendStylesheetWhenUrlMatches(head, /edition/gi, [config.revealTheme + 'edition.css']);
      resolve();
    });
  }

  function insertSlides() {
    return new Promise(function (resolve, reject) {

      var request = new XMLHttpRequest();

      console.log('Insert slides');

      request.onload = function () {
        var slideContainer = document.querySelector('.slides');

        function slideLoader(path){
          console.log('path:', path);
          var chapter = document.createElement('section');
          chapter.dataset.markdown = path;
          chapter.dataset.vertical = '^\r?\n\r?\n\r?\n';
          chapter.dataset.notes = '^Notes :';
          slideContainer.appendChild(chapter);
        }

        console.log('start');
        JSON.parse(request.responseText).forEach(slideLoader);
        console.log('end');

        resolve(slideContainer);
      };

      request.onerror = function (event) {
        console.error(event);
        reject('Erreur chargement des slides.');
      };

      request.open('GET', 'slides.json');
      request.send();
    });
  }

  function fileExists(url) {
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
        reject('File inacessible');
        console.log(event);
      };
      request.open('GET', url);
      request.send();
    });
  }


})(window, document, Promise, Reveal);
