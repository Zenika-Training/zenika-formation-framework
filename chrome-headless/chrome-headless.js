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
const fs = require('fs');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);

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

function connectToChrome(remoteInterface) {
  return new Promise((resolve, reject) => remoteInterface(resolve).on('error', reject));
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

async function run() {
  const launcher = await launchChrome();
  const protocol = await connectToChrome(chromeRemoteInterface);
  const { Page, Runtime } = protocol;
  await Page.enable();
  await Runtime.enable();
  await Page.navigate({ url: 'http://localhost:8000/?print-pdf' });
  await Page.loadEventFired();
  await waitForReveal(Runtime);
  const pdf = await Page.printToPDF({
    landscape: true,
    printBackground: true,
    // Paper size is in inches, this corresponds to A4
    paperWidth: 8.27,
    paperHeight: 11.69,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  });
  await writeFile(`${__dirname}/output.pdf`, pdf.data, { encoding: 'base64' });
  protocol.close();
  launcher.kill();
}

if (require.main === module) {
  run();
}
