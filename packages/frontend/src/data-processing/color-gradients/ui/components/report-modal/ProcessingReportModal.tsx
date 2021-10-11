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
import { Modal } from 'react-bootstrap';
import { ProcessingResult, Status } from '../../../ProcessingResult';
import { Parameters } from '../../../Parameters';
import { prefixedTranslation } from '../../../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './ProcessingReportModal.module.scss';

interface Props {
  result: ProcessingResult;
  params: Parameters;
  onClose: () => void;
}

const t = prefixedTranslation('DataProcessingModules:ColorGradients.');

class ProcessingReportModal extends Component<Props, {}> {
  public render(): ReactNode {
    const result = this.props.result;
    const params = this.props.params;
    const handleClose = this.props.onClose;
    const status = this.getStatusFromResult(result);

    return (
      <Modal show={true} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('End_of_processing')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={`p-3 ${Cls.modal}`}>
            {/* Status */}
            <div className={'mb-4'}>{status}</div>

            {/* Number of processed features */}
            {result.featuresProcessed > 0 && (
              <div className={'mb-3'}>{t('X_features_has_been_processed', { featuresProcessed: result.featuresProcessed })}</div>
            )}

            {/* Warning if no features processed */}
            {result.featuresProcessed < 1 && <div className={'mb-3'}>⚠️ {t('Nothing_has_been_processed')}</div>}

            {/* Number of invalid features */}
            {result.invalidFeatures > 0 && (
              <div
                className={'mb-3'}
                dangerouslySetInnerHTML={{
                  __html: t('Some_features_cannot_be_joined', {
                    invalidFeatures: result.invalidFeatures,
                    geometryJoinBy: params.geometries.joinBy || t('Undefined_property'),
                  }),
                }}
              />
            )}

            {/* Number of invalid values */}
            {result.invalidValues.length > 0 && (
              <div className={'mb-3'}>
                {t('Some_colors_values_are_incorrect', { invalidValues: result.invalidValues.length })}
                <pre>{result.invalidValues.join('\n')}</pre>
              </div>
            )}

            {/* Data rows not found by join key */}
            {result.missingDataRows.length > 0 && (
              <div className={'mb-3'}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t('Some_geometries_does_not_have_data', {
                      missingDataRows: result.missingDataRows.length,
                      joinBy: params.geometries.joinBy || t('Undefined_property'),
                    }),
                  }}
                />
                <pre>{result.missingDataRows.join('\n')}</pre>
              </div>
            )}
          </div>
          <div className={'mt-4 d-flex justify-content-end'}>
            <button onClick={handleClose} className={'btn btn-primary'} data-cy={'close-processing-report'}>
              {t('Close')}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  private getStatusFromResult(result: ProcessingResult) {
    switch (result.status) {
      case Status.Succeed:
        return <div className={'alert alert-primary'}>{t('Processing_done')} 🥳 </div>;
      case Status.BadProcessing:
        return <div className={'alert alert-warning'}>{t('Processing_done_with_warnings')} 🤷. </div>;
      case Status.InvalidValues:
        return <div className={'alert alert-warning'}>{t('Processing_was_interrupted_because_of_wrong_data')} 🖩 </div>;
      case Status.InvalidMinMax:
        return <div className={'alert alert-warning'}>{t('Processing_interrupted_data_must_be_greater_than_0')} 🖩</div>;
    }
  }
}

export default withTranslation()(ProcessingReportModal);
