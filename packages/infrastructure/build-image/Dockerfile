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

FROM node:14-buster

# Cypress dependencies
RUN apt-get update && \
      apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

# NodeJS
RUN npm i -g npm && npm install -g yarn --force

# Helm
RUN wget https://get.helm.sh/helm-v3.5.4-linux-amd64.tar.gz && tar -xf helm-v3.5.4-linux-amd64.tar.gz \
      && mv linux-amd64/helm /usr/local/bin

# K6
RUN wget https://github.com/k6io/k6/releases/download/v0.32.0/k6-v0.32.0-linux-amd64.deb \
      && dpkg -i k6-v0.32.0-linux-amd64.deb
