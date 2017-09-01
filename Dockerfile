# zenika/formations
FROM node:8
MAINTAINER Zenika <http://www.zenika.com>

# Required for running headless Chrome to generate PDFs
# Might be too many packages here, I have no idea what I'm doing
# https://github.com/GoogleChrome/puppeteer/issues/290#issuecomment-322921352
RUN apt-get update && \
    apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
    libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
    libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
    libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
    ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

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
