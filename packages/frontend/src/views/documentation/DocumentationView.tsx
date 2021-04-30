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
import { Logger } from '@abc-map/frontend-commons';
import { content as doc } from '@abc-map/documentation';
import { ServiceProps, withServices } from '../../core/withServices';
import Cls from './DocumentationView.module.scss';

const logger = Logger.get('Help.tsx', 'info');

class DocumentationView extends Component<ServiceProps, {}> {
  constructor(props: ServiceProps) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    return (
      <div className={Cls.documentation}>
        <h1>Aide</h1>
        <p>Sur cette page, vous trouverez des tutoriels et le manuel d&apos;Abc-Map.</p>
        <p>L&apos;aide est en cours de rédaction.</p>
        {doc && (
          <>
            <div className={'toc'} dangerouslySetInnerHTML={{ __html: doc.toc }} />
            {doc.modules.map((mod, i) => (
              <div key={i} className={Cls.module} dangerouslySetInnerHTML={{ __html: mod }} />
            ))}
          </>
        )}
      </div>
    );
  }
}

export default withServices(DocumentationView);
