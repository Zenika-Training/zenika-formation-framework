(function () {

  applyPrintStylesheets();
  insertSlides(function () {
    runReveal();
  });

  function applyPrintStylesheets() {
    function addStylesheetWhenUrlMatches(regexp, stylesheet) {
      if (!window.location.search.match(regexp)) return;
      var linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.type = 'text/css';
      linkElement.href = stylesheet;
      document.getElementsByTagName('head')[0].appendChild(linkElement);
    }
    addStylesheetWhenUrlMatches(/print-pdf/gi, '/reveal.js/css/print/pdf.css');
    addStylesheetWhenUrlMatches(/print-pdf/gi, '/reveal/theme-zenika/pdf.css');
    addStylesheetWhenUrlMatches(/edition/gi, '/reveal/theme-zenika/edition.css');
  }

  function insertSlides(callback) {
    var req = new XMLHttpRequest();
    req.onload = function () {
      var slideContainer = document.querySelector('.slides');
      JSON.parse(req.responseText).forEach(function (path) {
        var chapter = document.createElement('section');
        chapter.dataset.markdown = path;
        chapter.dataset.separatorVertical = '^\r?\n\r?\n\r?\n';
        chapter.dataset.separatorNotes = '^Notes :';
        slideContainer.appendChild(chapter);
      });
      callback();
    };
    req.open('GET', 'slides.json');
    req.send();
  }

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
        { src: 'reveal.js/lib/js/classList.js', condition: function() { return !document.body.classList; } },
        { src: 'reveal.js/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: 'reveal.js/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: 'reveal.js/plugin/highlight/highlight.js', async: true, callback: function() {

            var allCodeTags = document.querySelectorAll( 'pre code' );
            for(var i=0; i < allCodeTags.length; i++) {
              hljs.highlightBlock(allCodeTags[i]);
            }
          }
        },
        { src: 'reveal.js/plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
        { src: 'reveal.js/plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } },
        { src: 'reveal/plugins/zenika-footer/zenika-footer.js', condition: function() { return !!document.body.classList; } }
      ]
    });
  }

}());
