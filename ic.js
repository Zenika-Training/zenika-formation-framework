#!/usr/bin/env node

// or else the Gruntfile from the depending project will run the code!
if (require.main === module) {
  const request = require('request-promise-native');
  const username = process.env.CIRCLE_TOKEN;
  const password = '';
  const auth = `Basic ${new Buffer(`${username}:${password}`).toString('base64')}`;

  const projectName = process.argv[2] || require('./package.json').name;

  const firstCheckToken = {
    method: 'GET',
    uri: 'https://circleci.com/api/v1.1/me',
    headers: {
      Authorization: auth,
    },
    json: true,
    resolveWithFullResponse: false,
  };

  const secondCreateProject = {
    method: 'POST',
    uri: `https://circleci.com/api/v1/project/Zenika/${projectName}/follow`,
    headers: {
      Authorization: auth,
    },
    json: true,
  };

  const thirdSetEnvVariableGaeServiceAccount = {
    method: 'POST',
    uri: `https://circleci.com/api/v1/project/Zenika/${projectName}/envvar`,
    headers: {
      Authorization: auth,
    },
    body: {
      name: 'GAE_SERVICE_ACCOUNT',
      value: process.env.GAE_SERVICE_ACCOUNT,
    },
    json: true,
  };

  const thirdSetEnvVariableGaeKey = {
    method: 'POST',
    uri: `https://circleci.com/api/v1/project/Zenika/${projectName}/envvar`,
    headers: {
      Authorization: auth,
    },
    body: {
      name: 'GAE_KEY_FILE_CONTENT',
      value: process.env.GAE_KEY_FILE_CONTENT,
    },
    json: true,
  };

  const deleteCache = {
    method: 'DELETE',
    uri: `https://circleci.com/api/v1/project/Zenika/${projectName}/build-cache`,
    headers: {
      Authorization: auth,
    },
    json: true,
  };

  const retryMasterBuild = () => ({
    method: 'POST',
    uri: `https://circleci.com/api/v1/project/Zenika/${projectName}/tree/master`,
    headers: {
      Authorization: auth,
    },
    json: true,
  });

  request(firstCheckToken)
    .then(data => console.log(`👷 Welcome ${data.login}`))
    .then(() => request(secondCreateProject))
    .then((data) => {
      if (!data.first_build) return console.log(`🚧 Project ${projectName} already exists`);
      return console.log(`🚧 Project ${projectName} created`);
    })
    .then(() => request(thirdSetEnvVariableGaeServiceAccount))
    .then(() => request(thirdSetEnvVariableGaeKey))
    .then(() => console.log('🔧 Env variables set!'))
    .then(() => console.log('💣 Clearing cache...'))
    .then(() => request(deleteCache))
    .then(() => { console.log('✨ Re-building master'); })
    .then(() => request(retryMasterBuild()))
    .then(() => console.log('💚 All is done! Wait for a green deployment'))
    .catch(err => console.log('💩 AieAieAie!\n', err));
}
