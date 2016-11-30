# zenika/formations
FROM node:7.2-alpine
MAINTAINER Zenika <http://www.zenika.com>

# Install grunt
WORKDIR /data
RUN npm install --quiet grunt@^0.4.5 && \
    npm install --quiet --global grunt-cli

# Install zenika-formation-framework (ZFF)
WORKDIR /data/node_modules/zenika-formation-framework
COPY package.json deploy.js ./
RUN npm install --quiet
# Copy content from ZFF git repository
COPY . ./

# Ports 8000 (slides) and 32729 (live reload) should be exposed
EXPOSE 8000 32729

# Make grunt the default command
WORKDIR /data
CMD ["grunt"]
