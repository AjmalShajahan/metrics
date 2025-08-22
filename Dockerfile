FROM node:22-trixie-slim

WORKDIR /metrics

# Install system dependencies, Chrome and deno
RUN apt-get -qq update \
    && apt-get -qqy install wget curl unzip python3 \
    && wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && apt-get -qqy install ./google-chrome-stable_current_amd64.deb fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst-one fonts-freefont-ttf libxss1 libx11-xcb1 libxtst6 lsb-release -f --no-install-recommends \
    && curl -fsSL https://deno.land/x/install/install.sh | DENO_INSTALL=/usr/local sh \
    && rm google-chrome-stable_current_amd64.deb \
    && rm -rf /var/lib/apt/lists/*

# Install licensed gem
COPY --from=pkgxdev/pkgx:busybox /usr/local/bin/pkgx /usr/local/bin/pkgx
COPY --chmod=+x <<EOF /usr/local/bin/licensed
#!/usr/bin/env -S pkgx --shebang --quiet +github.com/licensee/licensed@5 -- licensed
EOF

# Copy only package files first for layer caching
COPY package*.json ./

# Install node modules
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_BROWSER_PATH="google-chrome-stable"
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build and set permissions
RUN npm run build && chmod +x /metrics/source/app/action/index.mjs

# Execute GitHub action
ENTRYPOINT [ "node", "/metrics/source/app/action/index.mjs" ]
