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

import React, { Component, ReactNode } from 'react';
import { FrontendRoutes, LayerType, Logger } from '@abc-map/shared';
import { Link } from 'react-router-dom';
import Cls from './HelpPanel.module.scss';

const logger = Logger.get('HelpPanel.tsx');

interface Props {
  type: LayerType;
}

class HelpPanel extends Component<Props, {}> {
  public render(): ReactNode {
    const type = this.props.type;

    return (
      <div className={Cls.help}>
        {type === LayerType.Predefined && <div>Les fonds de carte prédéfinis permettent d&apos;afficher facilement et rapidement une carte du monde.</div>}
        {type === LayerType.Vector && <div>Les couches de géométries permettent de dessiner des formes.</div>}

        <div className={Cls.datastoreAdvice}>
          <i className={'fa fa-info mr-3'} />
          <div>
            Vous ne trouvez pas ce que vous voulez ?<br />
            Essayez le <Link to={FrontendRoutes.dataStore().raw()}>Catalogue de données.</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default HelpPanel;
