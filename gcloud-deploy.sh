echo $GAE_KEY_FILE_CONTENT > file.key
google-cloud-sdk/bin/gcloud config set app/use_appengine_api false
google-cloud-sdk/bin/gcloud config set app/promote_by_default false
echo "Authenticate with $GAE_SERVICE_ACCOUNT"
google-cloud-sdk/bin/gcloud auth activate-service-account $GAE_SERVICE_ACCOUNT --key-file file.key
echo "Deploying to FORMATION_DEPLOY_NAME"
google-cloud-sdk/bin/gcloud --project FORMATION_DEPLOY_NAME preview app deploy --version $CURRENT_BRANCH --quiet dist/app.yaml
