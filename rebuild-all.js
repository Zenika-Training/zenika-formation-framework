#!/usr/bin/env node

if (require.main === module) { // or else the Gruntfile from the depending project will run the code!
  const childProcess = require('child_process')
  const request = require('request-promise-native');
  const username = process.env.CIRCLE_TOKEN;
  const password = '';
  const auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

  const projectName = process.argv[2] || require('./package.json').name

  const firstCheckToken = {
    method: 'GET',
    uri: 'https://circleci.com/api/v1.1/me',
    headers: {
      'Authorization': auth
    },
    json: true,
    resolveWithFullResponse: false,
  }

  const getProjects = {
    method: 'GET',
    uri: `https://circleci.com/api/v1/projects`,
    headers: {
      'Authorization': auth
    },
    json: true,
  }

  request(getProjects)
    .then(projects => {
      const projectsToRebuild = projects
        .map(project => {
          const urlSegments = project.vcs_url.split('/')
          return urlSegments[urlSegments.length - 1]
        })
        .filter(project => project.startsWith('formation-'))
      console.log(`rebuilding ${projectsToRebuild.length} projects`)
      projectsToRebuild.forEach(project => {
        console.log(project)
        childProcess.spawnSync('node', ['ic.js', project])
      })
    })
    .catch(err => console.log('💩 AieAieAie!\n', err))
}
