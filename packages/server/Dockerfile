# Copyright © 2023 Rémi Pace.
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

FROM node:18-alpine

# Dockerfiles are built with a context path at the root of the git repository

RUN npm i -g pnpm

RUN mkdir -p /srv
WORKDIR /srv

COPY pnpm-lock.yaml .
RUN pnpm fetch --prod

COPY . .
RUN pnpm install --frozen-lockfile --prod -f --filter @abc-map/server

ENV NODE_ENV=production
CMD node /srv/packages/server/build/main.js
