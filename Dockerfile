# zenika/formations
FROM dockerfile/nodejs-bower-grunt
MAINTAINER Vincent Demeester <vincent.demeester@zenika.com>

# Define the workdir for the rest of the commands
WORKDIR /data

# Make grunt as entrypoint
ENTRYPOINT ["grunt"]

# When making child images, run these commands
# The idea is to build an images for the formation that contains
# the needed libraries
ONBUILD COPY package.json /data/
ONBUILD RUN npm install
