# Copyright © 2021 Rémi Pace.
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

FROM ubuntu:focal

ENV DEBIAN_FRONTEND="noninteractive" TZ="Europe/London"

# Cypress dependencies
RUN apt-get update \
      && apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 \
                              libasound2 libxtst6 xauth xvfb fonts-emojione fonts-noto-color-emoji

# Chromium
COPY phd-chromium-browser /etc/apt/preferences.d/phd-chromium-browser
RUN apt-get install -y software-properties-common && add-apt-repository ppa:phd/chromium-browser \
     && apt-get update && apt-get -y install chromium-browser fonts-emojione fonts-noto-color-emoji

# We adapt chromium bin name for Cypress
RUN ln -s /usr/bin/chromium-browser /usr/bin/chromium

# Tools
RUN apt-get install -y bash curl git build-essential

# Helm
RUN curl -sL https://get.helm.sh/helm-v3.10.3-linux-amd64.tar.gz -o helm.tar.gz && tar -xf helm.tar.gz \
      && mv linux-amd64/helm /usr/local/bin

# K6
RUN curl -sL https://github.com/grafana/k6/releases/download/v0.45.0/k6-v0.45.0-linux-amd64.deb -o k6.deb \
      && dpkg -i k6.deb

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && apt-get install -y nodejs

# PNPM
RUN npm i -g pnpm