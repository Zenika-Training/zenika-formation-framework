/**
 * phantomjs script for printing presentations to PDF.
 *
 * Example:
 * phantomjs print-pdf.js "http://lab.hakim.se/reveal-js?print-pdf" reveal-demo.pdf
 *
 * By Manuel Bieh (https://github.com/manuelbieh)
 */

// html2pdf.js
(function (phantom) {
  'use strict';

  var page = new WebPage();
  var system = require('system');
  var fs = require('fs');

  page.viewportSize = {
    width: 1600,
    height: 900
  };

  page.paperSize = {
    format: 'A4',
    orientation: 'landscape'
  };

  // Debug mode
  var debug = system.args[3] === 'true';
  console.log('debug:', !!debug);

  // PDF path and file name
  var slideFile = system.args[2] || 'slides.pdf';
  if (slideFile.match(/\.pdf$/gi) === null) {
    slideFile += '.pdf';
  }

  console.log('Printing PDF...', Date.now());
  console.log('Pour un meilleur rendu : https://github.com/hakimel/reveal.js#pdf-export');

  var urlPrint = system.args[1] || 'index.html?print-pdf';
  page.open(urlPrint, function (status) {
    // hacked for being sure that content is loaded before printing
    if (status !== 'success') {
      console.log('Unable to load the address!');
      phantom.exit();
    } else {
      setTimeout(function () {

        if (debug) {
          // console.log(page.content);
          console.log('Save HTML content.');
          fs.write(slideFile + '.source.html', page.content, 'w');
          console.log('Take a scrennshot.');
          page.render(slideFile + '.screenshot.png');
        }

        console.log('Save PDF.', Date.now());
        page.render(slideFile, {
          format: 'pdf',
          quality: '100'
        });

        phantom.exit();
      }, 10000); // Change timeout as required to allow sufficient time
    }
  });

  // TO HELP DEBUG
  page.onConsoleMessage = function (msg) {
    if (debug) {
      console.log('Phantom console: ', msg);
    }
  };
  page.onResourceError = function (resourceError) {
    if (debug) {
      console.log('Unable to load resource: ', JSON.stringify(resourceError, null, 2));
    }
  };
  page.onResourceReceived = function (response) {
    if (debug) {
      if (response.stage === "end") {
        console.log('Received:', response.id, Date.now(), response.stage, response.url);
      }
      // console.log('Received:', JSON.stringify(response, null, 2));
    }
  };
  page.onResourceRequested = function (requestData, networkRequest) {
    if (debug) {
      console.log('Requested:', requestData.id, Date.now(), requestData.url);
      // console.log('Requested:', JSON.stringify(requestData, null, 2));
      // console.log('networkRequest:', networkRequest);
    }
  };
  page.onResourceTimeout = function (request) {
    console.log('Resource Timeout:', JSON.stringify(request, null, 2));
  };
  page.onLoadFinished = function (status) {
    if (debug) {
      console.log('Load finished. Status:', status);
    }
  };

})(phantom);
