/**
 * phantomjs script for printing presentations to PDF.
 *
 * Example:
 * phantomjs print-pdf.js "http://lab.hakim.se/reveal-js?print-pdf" reveal-demo.pdf
 *
 * By Manuel Bieh (https://github.com/manuelbieh)
 */

// html2pdf.js
var page = new WebPage();
var system = require('system');

page.viewportSize = {
    width: 1600,
    height: 900
};

page.paperSize = {
    format: 'A4',
    orientation: 'landscape'
};

var revealFile = system.args[1] || 'index.html?print-pdf';
var slideFile = system.args[2] || 'slides.pdf';

if (slideFile.match(/\.pdf$/gi) === null) {
    slideFile += '.pdf';
}

console.log('Printing PDF...');
console.log('Pour un meilleur rendu : https://github.com/hakimel/reveal.js#pdf-export');

page.open(revealFile, function (status) {
    // hacked for being sure that content is loaded before printing
    if (status !== 'success') {
        console.log('Unable to load the address!');
        phantom.exit();
    } else {
        setTimeout(function () {
            //console.log(page.content);

            page.render(slideFile, {format: 'pdf', quality: '100'});
            phantom.exit();

        }, 1000); // Change timeout as required to allow sufficient time
    }
});

