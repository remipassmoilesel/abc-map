/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

/*

If you want to deploy Helm chart with Abc-Cli, you must create a configuration file like this
then pass it to deploy command:

    $ ./abc-cli deploy /path/to/config.js

 */
module.exports = {
  releaseName: 'abc-map-production',
  registry: 'my-registry.gitlab.com',
  tag: 'my-tag',
  namespace: 'my-kubernetes-namespace',
  valuesFile: 'my-values-file',
  healthCheckUrl: 'https://my-abc-map-instance.fr/'
}
