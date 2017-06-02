// from https://developers.google.com/web/updates/2017/04/headless-chrome

const { ChromeLauncher } = require('lighthouse/lighthouse-cli/chrome-launcher');
const chrome = require('chrome-remote-interface');
const fs = require('fs');

/**
 * Launches a debugging instance of Chrome on port 9222.
 * @param {boolean=} headless True (default) to launch Chrome in headless mode.
 *     Set to false to launch Chrome normally.
 * @return {Promise<ChromeLauncher>}
 */
function launchChrome(headless = true) {
  const launcher = new ChromeLauncher({
    port: 9222,
    autoSelectChrome: true, // False to manually select which Chrome install.
    additionalFlags: [
      '--window-size=412,732',
      '--disable-gpu',
      headless ? '--headless' : '',
    ],
  });

  return launcher.run().then(() => launcher)
    .catch(err => launcher.kill().then(() => { // Kill Chrome if there's an error.
      throw err;
    }, console.error));
}

function timeout(t) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), t);
  });
}

function onPageLoad(Page) {
  const printPdfOptions = {
    landscape: true,
    printBackground: true,
    paperWidth: 8.27,
    paperHeight: 11.69,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  };
  return timeout(10000).then(() => Page.printToPDF(printPdfOptions).then((pdf) => {
    fs.writeFileSync(`${__dirname}/output.pdf`, pdf.data, { encoding: 'base64' });
  }));
}

launchChrome().then((launcher) => {
  chrome.Version().then(version => console.log(version['User-Agent']));
  chrome((protocol) => {
    // Extract the parts of the DevTools protocol we need for the task.
    // See API docs: https://chromedevtools.github.io/devtools-protocol/
    const { Page } = protocol;

    // First, enable the Page domain we're going to use.
    Page.enable().then(() => {
      Page.navigate({ url: 'http://localhost:8000/?print-pdf' });

      // Wait for window.onload before doing stuff.
      Page.loadEventFired(() => {
        onPageLoad(Page).then(() => {
          protocol.close();
          launcher.kill(); // Kill Chrome.
        });
      });
    });
  }).on('error', (err) => {
    throw Error(`Cannot connect to Chrome:${err}`);
  });
});
