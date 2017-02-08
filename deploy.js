#!/usr/bin/env node

if (require.main === module) {
  const execFileSync = require('child_process').execFileSync
  const fs = require('fs')

  const tempKeyFile = 'file.key'
  const gcloudSdkVersion = '135.0.0'
  const serviceAccount = process.env.GAE_SERVICE_ACCOUNT
  const gcloudProject = 'zen-formations'
  const gcloudService = process.env.npm_package_config_deploy_name
  const currentBranch = process.env.CURRENT_BRANCH

  if (!serviceAccount || !currentBranch) {
    console.log('Environment variables GAE_SERVICE_ACCOUNT or CURRENT_BRANCH not set.')
    console.log('Please check both are defined when running this script.')
    process.exit(1)
  }

  fs.writeFileSync(tempKeyFile, process.env.GAE_KEY_FILE_CONTENT)
  try {
    if (!process.argv.includes('--no-gcloud-update')) {
      console.log(`Updating Google Cloud SDK to version ${gcloudSdkVersion}`)
      execFileSync('gcloud', ['config', 'set', '--installation', 'component_manager/fixed_sdk_version', gcloudSdkVersion])
      execFileSync('gcloud', ['version'])
      execFileSync('sudo', ['/opt/google-cloud-sdk/bin/gcloud', '--quiet', 'components', 'update'])
      execFileSync('gcloud', ['version'])
    }
    console.log('Configuring Google Cloud SDK')
    execFileSync('gcloud', ['config', 'set', 'app/use_appengine_api', 'false'])
    execFileSync('gcloud', ['config', 'set', 'app/promote_by_default', 'false'])
    console.log('Authenticate with', serviceAccount)
    execFileSync('gcloud', ['auth', 'activate-service-account', serviceAccount, '--key-file', tempKeyFile])
    console.log(`Deploying to ${gcloudService}-dot-${gcloudProject}`)
    execFileSync('gcloud', ['--project', gcloudProject, 'app', 'deploy', '--version', currentBranch, '--quiet', 'dist/app.yaml'])
  } finally {
    fs.unlinkSync(tempKeyFile)
  }
}
