#!/usr/bin/env node

const assert = require('assert');
const fs = require('fs');
const rp = require('request-promise-native');
const username = process.env.CIRCLE_TOKEN;
const password = '';
const auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

var projectName = JSON.parse(fs.readFileSync('./package.json')).name;
//Override project name in the command line
if(process.argv.length === 3) projectName = process.argv[2]

const firstCheckToken = {
    method: 'GET',
    uri: 'https://circleci.com/api/v1.1/me',
    headers: {
      'Authorization': auth
    },
    json: true,
    resolveWithFullResponse: false,
};

const secondCreateProject = {
    method: 'POST',
    uri: `https://circleci.com/api/v1/project/Zenika/${projectName}/follow`,
    headers: {
      'Authorization': auth
    },
    json: true, // Automatically parses the JSON string in the response
};

const thirdSetEnvVariable1 = {
    method: 'POST',
    uri: `https://circleci.com/api/v1/project/Zenika/${projectName}/envvar`,
    headers: {
      'Authorization': auth
    },
    body: {
        name: 'GAE_SERVICE_ACCOUNT',
        value: process.env.GAE_SERVICE_ACCOUNT,
    },
    json: true,
};

const thirdSetEnvVariable2 = {
    method: 'POST',
    uri: `https://circleci.com/api/v1/project/Zenika/${projectName}/envvar`,
    headers: {
      'Authorization': auth
    },
    body: {
        name: 'GAE_KEY_FILE_CONTENT',
        value: process.env.GAE_KEY_FILE_CONTENT,
    },
    json: true,
};

const lastGetFirstGreenBuild = {
    method: 'POST',
    uri: `https://circleci.com/api/v1/project/Zenika/${projectName}/1/retry`,
    headers: {
      'Authorization': auth
    },
    json: true,
}

rp(firstCheckToken)
    .then(function (data) {
        assert(data.login, "jlandure")
        return console.log(`👷 Welcome ${data.login}`)
    })
    .then(function (data) {
        return rp(secondCreateProject)
    })
    .then(function (data) {
        if(!data.first_build) return console.log(`🚧 Project ${projectName} already exists`)
        return console.log(`🚧 Project ${projectName} created`)
    })
    .then(function (data) {
        return rp(thirdSetEnvVariable1)
    })
    .then(function (data) {
        return rp(thirdSetEnvVariable2)
    })
    .then(function (data) {
        return console.log(`🔧 Env variables set!`)
    })
    .then(function (data) {
        return rp(lastGetFirstGreenBuild)
    })
    .then(function (data) {
        return console.log(`💚 All is done! Wait for a green deployment`)
    })
    .catch(function (err) {
      console.log('💩 AieAieAie!\n', err)
        // API call failed...
    });
