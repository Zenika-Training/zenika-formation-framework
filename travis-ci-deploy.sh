echo $GAE_KEY_FILE_CONTENT > file.key
google-cloud-sdk/bin/gcloud auth activate-service-account $GAE_SERVICE_ACCOUNT --key-file file.key
google-cloud-sdk/bin/gcloud --project FORMATION_DEPLOY_NAME preview app deploy --version $TRAVIS_BRANCH --quiet dist/app.yaml
