/**
 * Copyright © 2026 Rémi Pace.
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

import type { ReactNode } from 'react';
import React, { Component } from 'react';
import { Logger } from '@abc-map/shared';
import { pageSetup } from '../../core/utils/page-setup';
import type { ServiceProps } from '../../core/withServices';
import { withServices } from '../../core/withServices';
import type { WithTranslation } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import Cls from './LegalMentionsView.module.scss';

const logger = Logger.get('LegalMentionsView.tsx', 'info');

type Props = ServiceProps & WithTranslation;

interface State {
  legalMentions?: string;
}

class LegalMentionsView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    const t = this.props.i18n.getFixedT(this.props.i18n.language, 'LegalMentionsView');
    const legalMentions = this.state.legalMentions;
    return (
      <div className={Cls.legalMentions}>
        <div className={Cls.content}>
          <h1 className={'mb-4'}>{t('About_this_platform')}</h1>

          {legalMentions && <div dangerouslySetInnerHTML={{ __html: legalMentions }} />}
        </div>
      </div>
    );
  }

  public componentDidMount() {
    const t = this.props.i18n.getFixedT(this.props.i18n.language, 'LegalMentionsView');
    const { legalMentions } = this.props.services;

    pageSetup(t('About_this_platform'));
    legalMentions
      .get()
      .then((legalMentions) => this.setState({ legalMentions }))
      .catch((err) => logger.error('Cannot fetch legal mentions: ', err));
  }
}

export default withTranslation()(withServices(LegalMentionsView));
