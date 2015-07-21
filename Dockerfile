# zenika/formations
FROM node:0.10
MAINTAINER Zenika <http://www.zenika.com>

# Install zenika-formation-framework (ZFF)
ENV ZFF_INSTALL_DIR /data/node_modules/zenika-formation-framework
RUN mkdir -p $ZFF_INSTALL_DIR
COPY package.json $ZFF_INSTALL_DIR/
WORKDIR $ZFF_INSTALL_DIR
RUN npm install

# Copy content from ZFF git repository
COPY . $ZFF_INSTALL_DIR/

# Install grunt
WORKDIR /data/
RUN npm install grunt@^0.4.5 
RUN npm install -g grunt-cli

# Ports 8000 (slides) and 32729 (live reload) should be exposed
EXPOSE 8000 32729

# Make grunt the default command
CMD ["grunt"]
