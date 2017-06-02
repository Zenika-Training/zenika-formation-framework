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

const timeout = util.promisify(setTimeout);
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

async function run() {
  const launcher = await launchChrome();
  const protocol = await connectToChrome(chromeRemoteInterface);
  const { Page } = protocol;
  await Page.enable();
  await Page.navigate({ url: 'http://localhost:8000/?print-pdf' });
  await Page.loadEventFired();
  // Leave time for the JS to kick in and render everything
  await timeout(10000);
  const printToPdfOptions = {
    landscape: true,
    printBackground: true,
    // Paper size is in inches, this corresponds to A4
    paperWidth: 8.27,
    paperHeight: 11.69,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  };
  const pdf = await Page.printToPDF(printToPdfOptions);
  await writeFile(`${__dirname}/output.pdf`, pdf.data, { encoding: 'base64' });
  protocol.close();
  launcher.kill();
}

run();
