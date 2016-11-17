#!/usr/bin/env node

if (require.main === module) {
  const execFileSync = require('child_process').execFileSync
  const fs = require('fs')

  const tempKeyFile = 'file.key'
  const serviceAccount = process.env.GAE_SERVICE_ACCOUNT
  const deployName = process.env.npm_package_config_deploy_name
  const currentBranch = process.env.CURRENT_BRANCH

  if (!serviceAccount || !currentBranch) {
    console.log('Environment variables GAE_SERVICE_ACCOUNT or CURRENT_BRANCH not set.')
    console.log('Please check both are defined when running this script.')
    process.exit(1)
  }

  fs.writeFileSync(tempKeyFile, process.env.GAE_KEY_FILE_CONTENT)
  try {
    console.log('Updating Google Cloud SDK')
    execFileSync('gcloud', ['--quiet', 'components', 'update', 'app'])
    console.log('Configuring Google Cloud SDK')
    execFileSync('gcloud', ['config', 'set', 'app/use_appengine_api', 'false'])
    console.log('Authenticate with', serviceAccount)
    execFileSync('gcloud', ['auth', 'activate-service-account', serviceAccount, '--key-file', tempKeyFile])
    console.log('Deploying to', deployName)
    execFileSync('gcloud', ['--project', deployName, 'preview', 'app', 'deploy', '--version', currentBranch, '--quiet', 'dist/app.yaml'])
  } finally {
    fs.unlinkSync(tempKeyFile)
  }
}

