/**
 * This script runs Chrome, connects to it via the debug protocol,
 * then navigates to localhost:8000 where the slides should be running,
 * then generates a PDF file on disk next to the script.
 *
 * Which Chrome to run is auto-detected using the Chrome Launcher from the
 * Lighthouse project.
 *
 * Resources:
 * Getting started with Chrome Headless
 * https://developers.google.com/web/updates/2017/04/headless-chrome
 * Chrome Remote Interface Documention
 * https://chromedevtools.github.io/devtools-protocol/
 */

const { ChromeLauncher } = require('lighthouse/lighthouse-cli/chrome-launcher');
const chromeRemoteInterface = require('chrome-remote-interface');

async function launchChrome() {
  const launcher = new ChromeLauncher({
    port: 9222,
    autoSelectChrome: true,
    additionalFlags: [
      '--disable-gpu',
      '--headless',
    ],
  });

  try {
    await launcher.run();
  } catch (err) {
    await launcher.kill();
    throw err;
  }

  return launcher;
}

function waitForReveal(Runtime) {
  return new Promise((resolve) => {
    const timer = setInterval(async () => {
      const slideChangedEvent = await Runtime.evaluate({
        expression: 'window.Reveal.isReady()',
      });
      if (slideChangedEvent.result.value) {
        clearInterval(timer);
        resolve();
      }
    }, 500);
  });
}

/**
 * @param {string} url URL where the slides are served
 * @returns {Promise<string>} PDF content in base64
 */
async function generatePdf(url, options) {
  const launcher = await launchChrome();
  const protocol = await chromeRemoteInterface();
  const { Page, Runtime } = protocol;
  await Page.enable();
  await Runtime.enable();
  await Page.navigate({ url });
  await Page.loadEventFired();
  await waitForReveal(Runtime);
  const pdf = await Page.printToPDF(options);
  protocol.close();
  launcher.kill();
  return pdf.data;
}

module.exports = generatePdf;
