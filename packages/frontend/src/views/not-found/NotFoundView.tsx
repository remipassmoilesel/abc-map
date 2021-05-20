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
import { Logger } from '@abc-map/shared';
import { Link } from 'react-router-dom';
import { FrontendRoutes } from '@abc-map/shared';
import Cls from './NotFoundView.module.scss';

const logger = Logger.get('NotFoundView.tsx');

class NotFoundView extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.notFoundView}>
        <h3>Cette page n&apos;existe pas !</h3>
        <Link to={FrontendRoutes.landing().raw()}>Retourner à l&apos;accueil</Link>
      </div>
    );
  }
}

export default NotFoundView;
