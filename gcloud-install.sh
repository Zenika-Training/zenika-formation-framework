echo "Downloading google cloud sdk";
wget https://dl.google.com/dl/cloudsdk/release/google-cloud-sdk.zip;
unzip -qq google-cloud-sdk.zip;
export CLOUDSDK_COMPONENT_MANAGER_FIXED_SDK_VERSION=0.9.86;
google-cloud-sdk/install.sh --usage-reporting false --path-update false --rc-path=~/.bashrc --bash-completion false;
google-cloud-sdk/bin/gcloud config set --scope=installation component_manager/fixed_sdk_version $CLOUDSDK_COMPONENT_MANAGER_FIXED_SDK_VERSION;
google-cloud-sdk/bin/gcloud components update --quiet;
