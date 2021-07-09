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
import Cls from './AboutView.module.scss';
import { pageSetup } from '../../core/utils/page-setup';
import { ServiceProps, withServices } from '../../core/withServices';

const logger = Logger.get('AboutView.tsx', 'info');

interface State {
  about?: string;
}

class AboutView extends Component<ServiceProps, State> {
  constructor(props: ServiceProps) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    const about = this.state.about;
    return (
      <div className={Cls.about}>
        <h1 className={'mb-4'}>A propos</h1>

        {about && <div dangerouslySetInnerHTML={{ __html: about }} />}
      </div>
    );
  }

  public componentDidMount() {
    pageSetup('A propos');
    this.props.services.about
      .get()
      .then((about) => this.setState({ about }))
      .catch((err) => logger.error('Cannot fetch legal mentions: ', err));
  }
}

export default withServices(AboutView);
