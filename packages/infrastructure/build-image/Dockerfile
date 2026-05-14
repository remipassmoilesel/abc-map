# Copyright © 2026 Rémi Pace.
# This file is part of Abc-Map.
#
# Abc-Map is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of
# the License, or (at your option) any later version.
#
# Abc-Map is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General
# Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.

FROM ubuntu:24.04

ENV DEBIAN_FRONTEND="noninteractive" TZ="Europe/London"

# Cypress dependencies
RUN apt-get update && apt-get install -y libgtk2.0-0t64 libgtk-3-0t64 libgbm-dev libnotify-dev libnss3 \
                            libxss1 libasound2t64 libxtst6 xvfb fonts-emojione fonts-noto-color-emoji

# Chromium
COPY phd-chromium-browser /etc/apt/preferences.d/phd-chromium-browser
RUN apt-get install -y software-properties-common && add-apt-repository ppa:xtradeb/apps -y \
     && apt-get update && apt-get -y install chromium

# node-canvas dependencies and others
RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Tools
RUN apt-get install -y bash curl git wget iputils-ping

# Helm
RUN curl -sL https://get.helm.sh/helm-v4.1.4-linux-amd64.tar.gz -o helm.tar.gz && tar -xf helm.tar.gz \
      && mv linux-amd64/helm /usr/local/bin

# K6
RUN curl -sL https://github.com/grafana/k6/releases/download/v1.6.1/k6-v1.6.1-linux-amd64.deb -o k6.deb \
      && dpkg -i k6.deb

# NodeJs and PNPM
ENV NODE_VERSION=24
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION"



