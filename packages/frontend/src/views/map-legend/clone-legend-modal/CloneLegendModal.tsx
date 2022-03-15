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

import React, { useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import { useAppSelector } from '../../../core/store/hooks';
import { CloneLegendButton } from './CloneLegendButton';
import { AbcLegend, LegendDisplay, Logger } from '@abc-map/shared';
import { nanoid } from 'nanoid';
import { useServices } from '../../../core/useServices';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';

const logger = Logger.get('CloneLegendModal');

const t = prefixedTranslation('MapLegendView:');

interface Props {
  legendId: string;
  onHide: () => void;
}

function CloneLegendModal(props: Props) {
  const { onHide, legendId } = props;
  const { project } = useServices();

  const layoutLegends = useAppSelector((st) => st.project.layouts.list)
    .map((layout) => layout.legend)
    .filter((legend) => legend.display !== LegendDisplay.Hidden);
  const sharedViewLegends = useAppSelector((st) => st.project.sharedViews.list)
    .map((layout) => layout.legend)
    .filter((legend) => legend.display !== LegendDisplay.Hidden);

  const handleLegendSelected = useCallback(
    (source: AbcLegend) => {
      const newLegend: AbcLegend = {
        ...source,
        items: source.items.map((item) => ({ ...item, id: nanoid() })),
        id: legendId,
      };

      project.updateLegend(newLegend);
    },
    [legendId, project]
  );

  return (
    <Modal show={true} onHide={onHide} centered>
      <Modal.Header closeButton>
        <h5>{t('Copy_another_legend')}</h5>
      </Modal.Header>
      <Modal.Body className={'d-flex flex-column'}>
        {!!layoutLegends.length && (
          <div className={'d-flex flex-column align-items-start mb-3'}>
            <h6>{t('Layouts')}</h6>
            {layoutLegends.map((legend, i) => (
              <CloneLegendButton
                key={legend.id}
                label={`${t('Page')} ${i + 1}`}
                legend={legend}
                disabled={legend.id === legendId}
                onClick={handleLegendSelected}
              />
            ))}
          </div>
        )}
        {!!sharedViewLegends.length && (
          <div className={'d-flex flex-column align-items-start'}>
            <h6>{t('Shared_views')}</h6>
            {sharedViewLegends.map((legend, i) => (
              <CloneLegendButton
                key={legend.id}
                label={`${t('View')} ${i + 1}`}
                legend={legend}
                disabled={legend.id === legendId}
                onClick={handleLegendSelected}
              />
            ))}
          </div>
        )}

        {!layoutLegends.length && !sharedViewLegends.length && <div className={'my3'}>{t('First_you_need_to_create_a_legend')}</div>}
      </Modal.Body>
      <Modal.Footer>
        <button onClick={onHide} className={'btn btn-outline-secondary'} data-cy={'close-modal'} data-testid={'close-modal'}>
          {t('Close')}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default withTranslation()(CloneLegendModal);
